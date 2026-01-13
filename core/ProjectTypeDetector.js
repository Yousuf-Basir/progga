const fs = require('fs');
const path = require('path');

class ProjectTypeDetector {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
  }

  detect() {
    const signals = [];

    if (this.isFlutterProject()) {
      signals.push({
        type: 'flutter',
        confidence: 'high',
        reason: 'pubspec.yaml found'
      });
    }

    // future:
    // if (this.isNodeProject()) ...
    // if (this.isPythonProject()) ...

    return signals;
  }

  isFlutterProject() {
    return fs.existsSync(
      path.join(this.projectRoot, 'pubspec.yaml')
    );
  }
}

module.exports = ProjectTypeDetector;
