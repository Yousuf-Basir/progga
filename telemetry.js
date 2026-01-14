require('dotenv').config();
const os = require('os')
const fs = require('fs')
const path = require('path')
const { PostHog } = require('posthog-node')
const pkg = require('./package.json')

const POSTHOG_KEY = process.env.POSTHOG_KEY;
const POSTHOG_HOST = process.env.POSTHOG_HOST || 'https://us.i.posthog.com';

const CONFIG_DIR = path.join(os.homedir(), '.progga')
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json')

let client = null;

if (POSTHOG_KEY) {
    client = new PostHog(POSTHOG_KEY, {
        host: POSTHOG_HOST,
        flushAt: 1,
        flushInterval: 0
    });
}

function getConfig() {
    try {
        if (!fs.existsSync(CONFIG_DIR)) {
            fs.mkdirSync(CONFIG_DIR);
        }

        if (fs.existsSync(CONFIG_FILE)) {
            return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        }
    } catch { }

    return {};
}

function saveConfig(config) {
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    } catch { }
}


function getOrCreateUserId() {
    try {
        if (!fs.existsSync(CONFIG_DIR)) {
            fs.mkdirSync(CONFIG_DIR)
        }

        if (fs.existsSync(CONFIG_FILE)) {
            const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))
            if (data.userId) return data.userId
        }

        const userId = cryptoRandomId()
        saveConfig({ userId });

        return userId
    } catch {
        return null
    }
}

function isTelemetryEnabled() {
  const config = getConfig();
  return config.telemetry !== false; // default ON
}

function cryptoRandomId() {
    return require('crypto').randomUUID()
}

function capture(event, properties = {}) {
    if (!client) return;
    if (!isTelemetryEnabled()) return;

    const distinctId = getOrCreateUserId();
    if (!distinctId) return;

    client.capture({
        distinctId,
        event,
        properties: {
            tool: 'progga',
            version: pkg.version,
            os: os.platform(),
            node: process.version,
            ...properties,
        },
    });

    client.flush().catch(() => { });
}

function maybeShowTelemetryNotice() {
  if (!process.stdin.isTTY) return;

  const config = getConfig();

  if (config.telemetry_notice_shown) return;

  console.log('');
  console.log('ℹ Progga collects anonymous usage data to improve the tool.');
  console.log('  No project files, paths, or code are ever collected.');
  console.log('');
  console.log('  You can disable telemetry anytime with:');
  console.log('    progga telemetry off');
  console.log('');

  saveConfig({
    ...config,
    telemetry_notice_shown: true,
  });
}


process.on('exit', () => {
  try {
    client?.shutdown();
  } catch {}
});

module.exports = { capture, maybeShowTelemetryNotice }
