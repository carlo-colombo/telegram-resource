module.exports = () => new Promise((resolve,reject) =>{
  let content = ''
  process.stdin.resume()
  process.stdin.on('data', buf => content += buf.toString() )
  process.stdin.on('end', () => resolve(JSON.parse(content)) )
})

