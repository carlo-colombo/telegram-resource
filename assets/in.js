const Api = require('./api-telegram')
const path = require('path')
const {kv, writeFile, jsonStdin} = require('./utils.js')

async function main(dest){
    try {
        const dest = process.argv.pop()

        const {regex, api, version} = readConfig(jsonStdin(), Api)

        const res = factory(api, version, regex)().pop()

        await writeFile(
            path.join(dest, 'message'),
            JSON.stringify(message))

        jsonStdout(JSON.stringify({
            version: {update_id: version.update_id.toString()},
            metadata: [
                kv('username', message.chat.username),
                kv('chat_id', message.chat.id)
            ]
        }))
    }catch (e) {
        console.error('error', e)
        jsonStdout([])
    }
}

if (require.main === module) {
  main()
}
