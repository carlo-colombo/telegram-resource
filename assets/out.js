const Api = require('./api-telegram')
const path = require('path')
const {kv, readFile, jsonStdin} = require('./utils.js')

async function main(dest){
    const {
        params: {chat_id: chat_id_file, text: text_file},
        source: {telegram_key}} = await jsonStdin()

    const api = new Api(telegram_key)

    const [chat_id, text] = await Promise.all([
        readFile(path.join(dest, chat_id_file)),
        readFile(path.join(dest, text_file))
    ])

    const {result: {chat}} = await api.sendMessage(chat_id, text)

    process.stdout.write(JSON.stringify({
        version: {},
        metadata: [
            kv('username', chat.username),
            kv('chat_id', chat.id)
        ]
    }))
}


main(process.argv.pop())
