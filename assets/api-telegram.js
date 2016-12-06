const https = require('https')
const querystring = require('querystring')

const request = (host, path, data) => new Promise((resolve, reject) => {
  const qs = querystring.stringify(data)

  const req = https.request({
    host,
    path: path + '?' + qs
  }, res => {
    let content = ''
    res.setEncoding('utf8');
    res.on('data', chunk => content += chunk )
    res.on('end', () => resolve(JSON.parse(content)) )
  })

  req.on('error', reject)
  req.end()
})



module.exports = class Api {
  constructor(telegram_key){
    this.telegram_key = telegram_key
    this.hostname = 'api.telegram.org'
  }
  getUpdates(offset = 0){
    return request(this.hostname, `/bot${this.telegram_key}/getupdates`, {offset})
  }
  sendMessage(chat_id, text){
    return request(this.hostname, `/bot${this.telegram_key}/sendMessage`, {chat_id, text})
  }
}
