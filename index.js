#!/usr/bin/env node

/**
 * Project Documentation Generator
 * Generates a single markdown file with folder structure and all file contents
 */

const fs = require('fs');
const path = require('path');
const ProfileRegistry = require('./profiles/ProfileRegistry');
const ProjectTypeDetector = require('./core/ProjectTypeDetector');
const PresetSelector = require('./core/PresetSelector');
const Spinner = require('./core/Spinner');

/**
 * Check if path should be ignored
 */
function shouldIgnore(filePath, basePath, profile) {
  const relativePath = path.relative(basePath, filePath);
  const parts = relativePath.split(path.sep);

  for (const part of parts) {
    if (profile.ignorePaths().includes(part)) {
      return true;
    }
  }

  const ext = path.extname(filePath);
  if (profile.ignoreExtensions().includes(ext)) {
    return true;
  }

  return false;
}

/**
 * Check if directory is empty (ignoring ignored items)
 */
function isDirectoryEmpty(directory, basePath) {
  try {
    const items = fs.readdirSync(directory);
    const validItems = items.filter(item => {
      const fullPath = path.join(directory, item);
      return !shouldIgnore(fullPath, basePath);
    });
    return validItems.length === 0;
  } catch (err) {
    return false;
  }
}

/**
 * Generate tree structure recursively
 */
function generateTree(directory, prefix = '', isLast = true, basePath = null, profile) {
  if (basePath === null) {
    basePath = directory;
  }

  const treeLines = [];

  try {
    let items = fs.readdirSync(directory).map(name => {
      const fullPath = path.join(directory, name);
      const stats = fs.statSync(fullPath);
      return { name, fullPath, isDir: stats.isDirectory() };
    });

    // Filter ignored items
    items = items.filter(item => !shouldIgnore(item.fullPath, basePath, profile));

    // Sort: directories first, then alphabetically
    items.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const isLastItem = i === items.length - 1;

      // Tree characters
      const connector = isLastItem ? '└── ' : '├── ';
      const extension = isLastItem ? '    ' : '│   ';

      if (item.isDir) {
        if (isDirectoryEmpty(item.fullPath, basePath)) {
          treeLines.push(`${prefix}${connector}${item.name}/ (empty)`);
        } else {
          treeLines.push(`${prefix}${connector}${item.name}/`);
          const subtree = generateTree(item.fullPath, prefix + extension, isLastItem, basePath, profile);
          treeLines.push(...subtree);
        }
      } else {
        // Check if file is empty
        const stats = fs.statSync(item.fullPath);
        if (stats.size === 0) {
          treeLines.push(`${prefix}${connector}${item.name} (empty)`);
        } else {
          treeLines.push(`${prefix}${connector}${item.name}`);
        }
      }
    }
  } catch (err) {
    // Permission error or other issues
  }

  return treeLines;
}

/**
 * Check if file is binary
 */
function isBinaryFile(filePath, profile) {
  const ext = path.extname(filePath);
  if (profile.binaryExtensions().includes(ext)) {
    return true;
  }

  try {
    const buffer = Buffer.alloc(1024);
    const fd = fs.openSync(filePath, 'r');
    const bytesRead = fs.readSync(fd, buffer, 0, 1024, 0);
    fs.closeSync(fd);

    for (let i = 0; i < bytesRead; i++) {
      if (buffer[i] === 0) return true;
    }
  } catch {
    return true;
  }

  return false;
}

/**
 * Read file content safely
 */
function readFileContent(filePath) {
  try {
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      return '(empty file)';
    }

    return fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    if (err.message.includes('invalid')) {
      try {
        return fs.readFileSync(filePath, 'latin1');
      } catch (e) {
        return '[Error: Unable to read file]';
      }
    }
    return `[Error: ${err.message}]`;
  }
}

/**
 * Get markdown language identifier from file extension
 */
function getLanguageFromExtension(filePath) {
  const extMap = {
    '.py': 'python',
    '.js': 'javascript',
    '.jsx': 'jsx',
    '.ts': 'typescript',
    '.tsx': 'tsx',
    '.html': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.json': 'json',
    '.md': 'markdown',
    '.yml': 'yaml',
    '.yaml': 'yaml',
    '.sh': 'bash',
    '.bash': 'bash',
    '.sql': 'sql',
    '.java': 'java',
    '.cpp': 'cpp',
    '.c': 'c',
    '.go': 'go',
    '.rs': 'rust',
    '.rb': 'ruby',
    '.php': 'php',
  };

  const ext = path.extname(filePath);
  return extMap[ext] || '';
}

/**
 * Collect all files recursively
 */
function collectFiles(directory, basePath, profile) {
  const files = [];

  try {
    const items = fs.readdirSync(directory);

    for (const item of items.sort()) {
      const fullPath = path.join(directory, item);

      if (shouldIgnore(fullPath, basePath, profile)) continue;

      const stats = fs.statSync(fullPath);

      if (stats.isFile()) {
        if (!isBinaryFile(fullPath, profile)) {
          files.push(fullPath);
        }
      } else if (stats.isDirectory()) {
        files.push(...collectFiles(fullPath, basePath, profile));
      }
    }
  } catch { }

  return files;
}

/**
 * Generate complete documentation markdown file
 */
function generateDocumentation(projectPath, outputFile, profile) {
  const absProjectPath = path.resolve(projectPath);

  if (!fs.existsSync(absProjectPath)) {
    console.error(`Error: Path '${absProjectPath}' does not exist`);
    process.exit(1);
  }

  console.log(`Generating documentation for: ${absProjectPath}`);
  console.log(`Output file: ${outputFile}`);

  // Delete existing output file if it exists
  if (fs.existsSync(outputFile)) {
    try {
      fs.unlinkSync(outputFile);
      console.log(`✓ Deleted existing file: ${outputFile}`);
    } catch (err) {
      console.warn(`Warning: Could not delete existing file: ${err.message}`);
    }
  }

  const projectName = path.basename(absProjectPath);
  let output = '';

  // Write header
  output += `# Project Documentation: ${projectName}\n\n`;
  output += `**Generated from:** \`${absProjectPath}\`\n\n`;
  output += '---\n\n';

  // Write folder structure
  output += '## 📁 Folder Structure\n\n';
  output += '```\n';
  output += `${projectName}/\n`;

  const treeSpinner = new Spinner('Generating folder structure');
  const treeLines = generateTree(absProjectPath, '', true, absProjectPath, profile);
  treeSpinner.succeed('Folder structure generated');

  for (const line of treeLines) {
    output += `${line}\n`;
  }

  output += '```\n\n';
  output += '---\n\n';

  // Write file contents
  output += '## 📄 File Contents\n\n';

  const fileSpinner = new Spinner('Collecting files');
  const files = collectFiles(absProjectPath, absProjectPath, profile);
  fileSpinner.succeed(`Collected ${files.length} files`);

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const relPath = path.relative(absProjectPath, filePath);
    console.log(`Processing (${i + 1}/${files.length}): ${relPath}`);

    output += `### \`${relPath}\`\n\n`;

    const content = readFileContent(filePath);
    const language = getLanguageFromExtension(filePath);

    output += `\`\`\`${language}\n`;
    output += content;
    if (!content.endsWith('\n')) {
      output += '\n';
    }
    output += '```\n\n';
    output += '---\n\n';
  }

  // Write to file
  fs.writeFileSync(outputFile, output, 'utf-8');

  console.log(`\n✅ Documentation generated successfully: ${outputFile}`);
  console.log(`📊 Total files processed: ${files.length}`);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  let projectPath = '.';
  let outputFile = 'PROJECT_DOCUMENTATION.md';
  let projectType = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--project-type' || arg === '--preset') {
      projectType = args[i + 1];
      i++;
    } else if (!projectPath) {
      projectPath = arg;
    } else if (!outputFile) {
      outputFile = arg;
    }
  }

  let profile = ProfileRegistry.getByName(projectType, projectPath);

  if (!profile) {
    const detector = new ProjectTypeDetector(projectPath);
    const detections = detector.detect();

    const flutterSignal = detections.find(d => d.type === 'flutter');

    if (flutterSignal && process.stdin.isTTY) {
      console.log('');
      console.log(`Detected project type: ${flutterSignal.type}`);
      console.log('');

      const selectedPreset = await PresetSelector.choose(flutterSignal.type);
      profile = ProfileRegistry.getByName(selectedPreset, projectPath);
    }
  }

  if (!profile) {
    profile = ProfileRegistry.fallback(projectPath);
  }

  console.log(`Using profile: ${profile.name}`);
  generateDocumentation(projectPath, outputFile, profile);
}

main();