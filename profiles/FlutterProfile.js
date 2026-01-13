const ProjectProfile = require('./ProjectProfile');

class FlutterProfile extends ProjectProfile {
  get name() {
    return 'flutter';
  }

  ignorePaths() {
    return [
      // Dart / Flutter
      '.dart_tool',
      'build',
      '.flutter-plugins',
      '.flutter-plugins-dependencies',

      // Android
      'android/.gradle',
      'android/build',
      'android/app/build',

      // iOS / macOS
      'ios/Flutter/ephemeral',
      'ios/Runner.xcodeproj',
      'ios/Runner.xcworkspace',
      'macos/Flutter/ephemeral',
      'macos/Runner.xcodeproj',

      // Web
      'build/web',

      // Windows
      'windows/build',

      // Linux
      'linux/build',

      // Common IDE noise
      '.git',
      '.idea',
      '.vscode',
      '.DS_Store',
    ];
  }

  ignoreExtensions() {
    return [
      // Assets & binaries
      '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
      '.mp4', '.mp3', '.wav',
      '.ttf', '.otf', '.woff', '.woff2',

      // Archives
      '.zip', '.rar', '.tar', '.gz',

      // Compiled outputs
      '.exe', '.dll', '.so', '.dylib',
    ];
  }

  binaryExtensions() {
    return this.ignoreExtensions();
  }
}

module.exports = FlutterProfile;
