const ora = require('ora').default;

class Spinner {
  constructor(text) {
    this.enabled = process.stdout.isTTY;
    this.spinner = this.enabled ? ora(text).start() : null;
  }

  succeed(text) {
    if (this.spinner) {
      this.spinner.succeed(text);
    } else {
      console.log(`✓ ${text}`);
    }
  }

  fail(text) {
    if (this.spinner) {
      this.spinner.fail(text);
    } else {
      console.error(`✗ ${text}`);
    }
  }

  update(text) {
    if (this.spinner) {
      this.spinner.text = text;
    }
  }
}

module.exports = Spinner;
