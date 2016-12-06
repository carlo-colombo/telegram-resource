const fs = require('fs')

function readFile(file){
  return new Promise((resolve,reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

const kv = (name, value) => ({name, value: value.toString()})

const jsonStdin = () => new Promise((resolve,reject) =>{
  let content = ''
  process.stdin.resume()
  process.stdin.on('data', buf => content += buf.toString() )
  process.stdin.on('end', () => resolve(JSON.parse(content)) )
})


module.exports = {readFile, kv, jsonStdin}
