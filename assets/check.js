const jsonStdin = require('./json-stdin')
const Api = require('./api-telegram.js')

async function main(){
  const {
    source: {filter = ".*", telegram_key, flags},
    version: {update_id}
  } = await jsonStdin()

  const api = new Api(telegram_key)

  const {result} = await api.getUpdates(update_id)

  process.stdout.write(JSON.stringify(check(result, new RegExp(filter, flags))))

}

function check(result, filter){
  return result
    .filter( ({message: {text}}) => filter.test(text))
    .map( ({update_id}) => ({update_id}) )
}

 module.exports = main

