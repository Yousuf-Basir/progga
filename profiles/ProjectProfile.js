class ProjectProfile {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
  }

  get name() {
    return 'base';
  }

  /** Paths to fully ignore */
  ignorePaths() {
    return [];
  }

  /** Extensions to ignore */
  ignoreExtensions() {
    return [];
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
