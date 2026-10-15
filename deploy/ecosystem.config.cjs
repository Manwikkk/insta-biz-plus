// PM2 runs the site from <APP_DIR>/current, the release deploy/release.sh last switched to.
// Settings that must not live in git (CONTACT_WEBHOOK_URL=…) go in <APP_DIR>/shared/.env, one per line.
const fs = require('node:fs')
const path = require('node:path')

const dir = process.env.APP_DIR || '/var/www/instabizweb'
const env = {}
try {
  for (const line of fs.readFileSync(path.join(dir, 'shared', '.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/)
    if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2')
  }
} catch {
  // no shared settings yet
}

module.exports = {
  apps: [
    {
      name: process.env.APP_NAME || 'instabizweb',
      cwd: path.join(dir, 'current'),
      script: 'server.js',
      // cluster mode: a reload starts the new release before the old one stops, so no request is dropped
      exec_mode: 'cluster',
      instances: 1,
      max_memory_restart: '700M',
      env: { NODE_ENV: 'production', PORT: process.env.APP_PORT || '3000', HOSTNAME: '127.0.0.1', ...env },
    },
  ],
}
