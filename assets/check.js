#!/usr/bin/env node --harmony-async-await
// vim: set ft=js
/*
source $(dirname $0)/_get_updates.sh

jq -M  ".result |  map(select(.message.text == '${filter}') | map({ update_id: .update_id | tostring })"  < $updates >&3
*/

const jsonStdin = require('./json-stdin')
const Api = require('./api-telegram.js')

// const request => (path, host, data) => new Promise( (resolve, reject) => {
//   const req = http.request({
//     var req = http.request(options, (res) => {
//       console.log(`STATUS: ${res.statusCode}`);
//       console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//       res.setEncoding('utf8');
//       res.on('data', (chunk) => {
//             console.log(`BODY: ${chunk}`);
//           });
//         res.on('end', () => {
//               console.log('No more data in response.');
//             });
//     });

//     req.on('error', (e) => {
//         console.log(`problem with request: ${e.message}`);
//     });

//     // write data to request body
//     // req.write(postData);
//     // req.end();
//   }, (res) => {
//     console.log(`STATUS: ${res.statusCode}`);
//     console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//     let content = ''
//   });

//   req.on('error', e => reject(e))
//   return updates.filter(update => !filter || update.text
//   // write data to request body
//   // req.write(postData);
//   // req.end();
// })

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
