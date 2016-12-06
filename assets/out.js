/*
#!/bin/sh
# vim: set ft=sh

source $(dirname $0)/_common.sh

chat_id=$(cat $1/$(jq -r '.params.chat_id' < $payload))
text=$(cat $1/$(jq -r '.params.text' < $payload))



base_url="https://api.telegram.org/bot${telegram_key}/sendMessage"
resp=$(curl "$base_url?chat_id=${chat_id}&text=${text}")

echo $resp | jq -M '{version: {update_id: null}}' >&3
*/

const jsonStdin = require('./json-stdin')
const Api = require('./api-telegram')
const path = require('path')
const {kv, readFile} = require('./utils.js')

async function main(dest){
    const {
        params: {chat_id: chat_id_file, text: text_file},
        source: {telegram_key}} = await jsonStdin()

    const [chat_id, text] = await Promise.all([
        readFile(path.join(dest, chat_id_file)),
        readFile(path.join(dest, text_file))
    ])

    const api = new Api(telegram_key)

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
