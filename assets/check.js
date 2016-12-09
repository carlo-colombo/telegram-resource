const {jsonStdin} = require('./utils')
const Api = require('./api-telegram.js')

async function main(){
    try {
        const {
            source: {filter = ".*", telegram_key, flags},
            version
        } = await jsonStdin()

        const {update_id} = version || {}
        const api = new Api(telegram_key)
        const {result} = await api.getUpdates(update_id)
        process.stdout.write(JSON.stringify(check(result, new RegExp(filter, flags))))
    } catch(e){
        console.error(e)
        process.stdout.write('[]')
        process.exit(1)
    }
}

function check(result, filter){
    return result
    .filter(({message: {text}}) => filter.test(text))
    .map(({update_id}) => ({update_id: update_id.toString()}) )
}

main()
