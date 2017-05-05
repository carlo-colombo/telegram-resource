/*  */
const fs = require('fs')

function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

function writeFile(file, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function kv(name, value) {
  return {
    name,
    value: ('' + value).toString()
  }
}

const jsonStdin = () =>
  new Promise((resolve, reject) => {
    let content = ''
    process.stdin.resume()
    process.stdin.on('data', buf => (content += buf.toString()))
    process.stdin.on('end', () => {
      try {
        resolve(JSON.parse(content))
      } catch (e) {
        reject(e)
      }
    })
  })

async function jsonStdout(val) {
  process.stdout.write(JSON.stringify(await val))
}

async function readConfig(config, MessagingApi) {
  const {
    source: { filter = '.*', telegram_key, flags },
    version,
    params
  } = await config

  return {
    regex: new RegExp(filter, flags),
    api: new MessagingApi(telegram_key),
    version,
    params
  }
}

module.exports = {
  readFile,
  kv,
  jsonStdin,
  writeFile,
  jsonStdout,
  readConfig
}
