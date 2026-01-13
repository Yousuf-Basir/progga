class ProjectProfile {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.cliIgnorePaths = [];
    this.cliIgnoreExtensions = [];
  }

  applyCliIgnores(list) {
    for (const item of list) {
      if (item.startsWith('.')) {
        this.cliIgnoreExtensions.push(item);
      } else {
        this.cliIgnorePaths.push(item);
      }
    }
  }

  get name() {
    return 'base';
  }

  /** Paths to fully ignore */
  ignorePaths() {
    return this.cliIgnorePaths;
  }

  /** Extensions to ignore */
  ignoreExtensions() {
    return this.cliIgnoreExtensions;
  }

  /** Binary extensions */
  binaryExtensions() {
    return [];
  }

  /** Should this profile auto-detect the project */
  detect() {
    return false;
  }
}

module.exports = ProjectProfile;
