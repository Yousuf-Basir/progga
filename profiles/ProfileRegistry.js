const GenericProfile = require('./GenericProfile');
const FlutterProfile = require('./FlutterProfile');

class ProfileRegistry {
  static getByName(name, projectRoot) {
    if (!name) return null;

    if (name === 'flutter') {
      return new FlutterProfile(projectRoot);
    }

    if (name === 'generic') {
      return new GenericProfile(projectRoot);
    }

    return null;
  }

  static fallback(projectRoot) {
    return new GenericProfile(projectRoot);
  }
}

module.exports = ProfileRegistry;
