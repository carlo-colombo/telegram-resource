/*
#!/bin/sh
# vim: set ft=sh

source $(dirname $0)/_get_updates.sh

message=$1/message

jq '.result | last'  < $updates > $message

jq '.result | last | { version: {update_id: .update_id | tostring }, metadata: [{name: "author", value: .message.from | tostring} ,{name: "message", value: .message.text}]}'  < $updates >&3
*/
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

    const {update_id, message} = check(result, new RegExp(filter, flags)).pop()

    await writeFile(path.join(dest, 'message'), JSON.stringify(message))

    process.stdout.write(JSON.stringify({
        version: {update_id: update_id},
        metadata: [
            kv('username', message.chat.username),
            kv('chat_id', message.chat.id)
        ]
    }))
}

main(process.argv.pop())
