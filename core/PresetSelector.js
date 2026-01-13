const select = require('@inquirer/select').default;

class PresetSelector {
  static async choose(detectedType) {
    const preset = await select({
      message: 'Select how you want to proceed:',
      choices: [
        {
          name: `Use ${detectedType} preset (recommended)`,
          value: detectedType
        },
        {
          name: 'Use generic preset',
          value: 'generic'
        }
      ]
    });

    return preset;
  }
}

module.exports = PresetSelector;
