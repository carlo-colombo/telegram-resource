const {jsonStdin} = require('./utils')
const Api = require('./api-telegram.js')


function check(result, filter){
    return result
        .filter(({message: {text}}) => filter.test(text))
        .map(({update_id}) => ({update_id: update_id.toString()}) )
}

function factory(jsonConfig, MessagingApi){
    return async function main(){
        try {
            const {
                source: {filter = ".*", telegram_key, flags},
                version
            } = await Promise.resolve(jsonConfig())

            const {update_id} = version || {}
            const api = new MessagingApi(telegram_key)
            const {result} = await api.getUpdates(update_id)
            process.stdout.write(JSON.stringify(check(result, new RegExp(filter, flags))))
        } catch(e){
            console.log('err')
            console.error(e)
            process.stdout.write('[]')
            return []
        }
    }
}

module.exports = factory

factory(jsonStdin, Api)
