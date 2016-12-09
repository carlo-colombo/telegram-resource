const Api = require('./api-telegram')
const path = require('path')
const {kv, writeFile, jsonStdin} = require('./utils.js')

function check(result, filter){
    return result
    .filter(({message: {text}}) => filter.test(text))
}

async function main(dest){
    try {
        const {
            source: {filter = ".*", telegram_key, flags},
            version
        } = await jsonStdin()

        const api = new Api(telegram_key)

        const {update_id} = version || {}
        const {result} = await api.getUpdates(update_id)

        const {message} = check(result, new RegExp(filter, flags)).pop()

        await writeFile(path.join(dest, 'message'), JSON.stringify(message))

        process.stdout.write(JSON.stringify({
            version: {update_id: update_id.toString()},
            metadata: [
                kv('username', message.chat.username),
                kv('chat_id', message.chat.id)
            ]
        }))
    }catch (e) {
        console.error(e)
        process.exit(1)
    }
}

main(process.argv.pop())
