# progga (প্রজ্ঞা)

> *Progga* means "wisdom" or "insight" in Bengali

Generate comprehensive project documentation in a single markdown file - perfect for sharing your entire codebase context with AI assistants like ChatGPT, Claude, or Gemini.

## 🎯 Purpose

Upload one file, understand the entire project. **progga** creates a complete project snapshot that AI assistants can instantly comprehend, making it easy to:

- 💬 Get AI help with your entire codebase
- 📤 Share project context without multiple file uploads
- 🤖 Enable ChatGPT/Claude/Gemini to understand your project structure
- 📚 Create comprehensive documentation snapshots

## ✨ Features

- 📁 Visual folder tree structure
- 📄 All file contents with syntax highlighting
- 🚫 Automatically ignores dependencies and build artifacts
- ⚡ One command, one file, complete context
- 🎯 Optimized for AI consumption

## 🚀 Installation

### Using npx (Recommended - No Installation!)
```bash
npx progga
```

### Global Installation
```bash
npm install -g progga
```

## 📖 Usage

### Basic Usage

Generate documentation for current directory:
```bash
npx progga
```

This creates `PROJECT_DOCUMENTATION.md` in your current directory.

### Specify Project Path
```bash
npx progga /path/to/your/project
```

### Custom Output File
```bash
npx progga . my-ai-context.md
```

### Full Example
```bash
npx progga ./my-app ./docs/ai-context.md
```

## 💡 How to Use with AI Assistants

1. Run `npx progga` in your project directory
2. Upload the generated `PROJECT_DOCUMENTATION.md` to ChatGPT, Claude, or Gemini
3. Ask the AI anything about your project!

Example prompts after upload:
- "Review my code architecture"
- "Find potential bugs"
- "Suggest improvements"
- "Explain how this project works"
- "Help me add a new feature"

## 🚫 What Gets Ignored

Automatically excludes:
- `node_modules/`, `.git/`
- Build directories (`dist/`, `build/`, `.next/`)
- Virtual environments (`venv/`, `env/`)
- Cache directories
- Lock files
- Binary files (images, videos, fonts)

## 📊 Output Format
```markdown
# Project Documentation: your-project

## 📁 Folder Structure
[Visual tree of all files and folders]

## 📄 File Contents
[Complete contents of each file with syntax highlighting]
```

## 🌍 Requirements

- Node.js >= 12.0.0

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💖 Name Origin

**Progga** (প্রজ্ঞা) is a Bengali word meaning "wisdom" or "insight" - representing the wisdom you share with AI assistants about your codebase.