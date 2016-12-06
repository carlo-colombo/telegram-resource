const fs = require('fs')
const path = require('path');

function readFile(file){
  return new Promise((resolve,reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

const kv = (name, value) => ({name, value: value.toString()})

module.exports = {readFile, kv}
