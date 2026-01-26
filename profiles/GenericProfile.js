const ProjectProfile = require('./ProjectProfile');

class GenericProfile extends ProjectProfile {
  get name() {
    return 'generic';
  }

  ignorePaths() {
    return [
      'node_modules',
      '.git',
      '__pycache__',
      '.vscode',
      'dist',
      'build',
      '.next',
      'venv',
      '.venv',
      'env',
      '.env',
      'coverage',
      '.pytest_cache',
      '.DS_Store',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'bun.lock',
      '.turbo'
    ];
  }

  ignoreExtensions() {
    return [
      '.pyc',
      '.pyo',
      '.so',
      '.dylib',
      '.exe',
      '.dll',
    ];
  }

  binaryExtensions() {
    return [
      '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg',
      '.pdf', '.zip', '.tar', '.gz', '.rar',
      '.mp4', '.mp3', '.wav',
      '.woff', '.woff2', '.ttf', '.eot',
    ];
  }
}

module.exports = GenericProfile;
