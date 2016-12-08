const Api = require('./api-telegram')
const path = require('path')
const {kv, writeFile, jsonStdin} = require('./utils.js')

function check(result, filter){
    return result
    .filter(({message: {text}}) => filter.test(text))
}

async function main(dest){
    const {
        source: {filter = ".*", telegram_key, flags},
        version: {update_id: last_update_id}
    } = await jsonStdin()

    const api = new Api(telegram_key)

    const {result} = await api.getUpdates(last_update_id)

    try {
        const {update_id, message} = check(result, new RegExp(filter, flags)).pop()

        await writeFile(path.join(dest, 'message'), JSON.stringify(message))

        process.stdout.write(JSON.stringify({
            version: {update_id: update_id},
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
