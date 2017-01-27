const Api = require('./api-telegram')
const path = require('path')
const {kv, writeFile, jsonStdin, jsonStdout, readConfig} = require('./utils.js')
const {check} = require('./check.js')

async function main(readConfig, jsonStdin, Api, check, writeFile, dest){
    try {
        const {regex, api, version} = await readConfig(jsonStdin(), Api)

        const message = check(api, version, regex).pop()

        if(!message) return {}

        await writeFile(
            path.join(dest, 'message'),
            JSON.stringify(message))

        return {
            version: {update_id: version.update_id.toString()},
            metadata: [
                kv('username', message.chat.username),
                kv('chat_id', message.chat.id)
            ]
        }
    }catch (e) {
        console.error('error', e)
        return {}
    }
}


module.exports = {
     main
}

if (require.main === module) {
  jsonStdout(main(readConfig, jsonStdin, Api, check, writeFile, process.argv.pop()))
}
