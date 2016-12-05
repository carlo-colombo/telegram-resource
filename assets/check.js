#!/usr/bin/env node --harmony-async-await
// vim: set ft=js
/*
source $(dirname $0)/_get_updates.sh

jq -M  ".result |  map(select(.message.text == '${filter}') | map({ update_id: .update_id | tostring })"  < $updates >&3
*/

const jsonStdin = require('./json-stdin')
const Api = require('./api-telegram.js')

async function main(){
  const {
    source: {filter, telegram_key},
    version: {update_id}
  } = await jsonStdin()

  const api = new Api(telegram_key)

  const resp = await api.getUpdates()

  console.log(filter, telegram_key, resp)
}


main()
