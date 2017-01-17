const {jsonStdin, jsonStdout} = require('./utils')
const Api = require('./api-telegram.js')


function check(result, filter){
    return result
        .filter(({message: {text}}) => filter.test(text))
        .map(({update_id}) => ({update_id: update_id.toString()}) )
}

async function readConfig(config, MessagingApi){
        const {
            source: {filter = ".*", telegram_key, flags},
            version
        } = await Promise.resolve(config)

    return {
        regex: new RegExp(filter, flags),
        api: new MessagingApi(telegram_key),
        version
    }
}

function factory(api, version = {}, regex = /.*/){
    return async function main(){
        const {update_id} = version || {}
        const {result} = await api.getUpdates(update_id)
        return check(result, regex)
    }
}

module.exports = factory

if (require.main === module) {
    try{
        const {regex, api, version} = readConfig(jsonStdin(), Api)

        jsonStdout(factory(api, version, regex)())
        // process.stdout.write(JSON.stringify(factory(jsonStdin, Api)()))
    } catch(e){
        console.error('error', e)
        jsonStdout([])
    }
}
