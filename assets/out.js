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

async function main(){
    const {
        params: {chat_id, text},
        source: {telegram_key}} = await jsonStdin()

    const api = new Api(telegram_key)

    const resp = await api.sendMessage(chat_id, text)

    console.log(resp)
}


main()
