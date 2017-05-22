const Api = require('./api-telegram')
const path = require('path')
const { kv, writeFile, jsonStdout } = require('./utils.js')
const { readConfig } = require('./wirings')
const { check } = require('./check.js')

async function main(readConfig, check, writeFile, dest) {
  try {
    const { regex, api, version } = await readConfig()

    const { update_id, message } = (await check(api, version, regex)).pop()

    if (!message) return {}

    writeFile(path.join(dest, 'message'), JSON.stringify(message))

    return {
      version: { update_id: update_id.toString() },
      metadata: [
        kv('username', message.chat.username),
        kv('chat_id', message.chat.id),
        kv('text', message.text)
      ]
    }
  } catch (e) {
    console.error('error', e)
    return {}
  }
}

module.exports = {
  main
}

if (require.main === module) {
  jsonStdout(main(readConfig, check, writeFile, process.argv.pop()))
}
