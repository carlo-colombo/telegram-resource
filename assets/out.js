const Api = require('./api-telegram')
const path = require('path')
const {kv, readFile, jsonStdin} = require('./utils.js')

async function main(dest){
    try{
        const {
            params: {chat_id: chat_id_file, text: text_file},
            source: {telegram_key}} = await jsonStdin()

        const api = new Api(telegram_key)

        console.error('error', telegram_key)
        const [chat_id, text] = await Promise.all([
            readFile(path.join(dest, chat_id_file)),
            readFile(path.join(dest, text_file))
        ])
        console.error('error', chat_id, text)
        // const {result: {chat}} = await api.sendMessage(chat_id, text)
        const resp = await api.sendMessage(chat_id, text)
        console.error('error', resp)
        const {result: {chat}} = resp

        process.stdout.write(JSON.stringify({
            version: {},
            metadata: [
                kv('username', chat.username),
                kv('chat_id', chat.id.toString())
            ]
        }))
    }  catch(e){
        console.error(e)
        process.exit(1)
    }
}

main(process.argv.pop())
