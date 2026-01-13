const GenericProfile = require('./GenericProfile');

class ProfileRegistry {
  static getByName(name, projectRoot) {
    if (!name) return null;

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
