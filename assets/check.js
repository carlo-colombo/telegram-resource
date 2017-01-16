const {jsonStdin} = require('./utils')
const Api = require('./api-telegram.js')


function check(result, filter){
    return result
        .filter(({message: {text}}) => filter.test(text))
        .map(({update_id}) => ({update_id: update_id.toString()}) )
}

function factory(jsonConfig, MessagingApi){
    return async function main(){
        const {
            source: {filter = ".*", telegram_key, flags},
            version
        } = await Promise.resolve(jsonConfig())

        const {update_id} = version || {}
        const api = new MessagingApi(telegram_key)
        const {result} = await api.getUpdates(update_id)
        return check(result, new RegExp(filter, flags))
    }
}

module.exports = factory

if (require.main === module) {
    try{
        process.stdout.write(JSON.stringify(factory(jsonStdin, Api)()))
    } catch(e){
        console.error('error', e)
        return []
    }
}
