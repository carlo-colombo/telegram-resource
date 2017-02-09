const fs = require('fs');

function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function writeFile(file, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

const kv = (name, value) => ({ name, value: value.toString() });

const jsonStdin = () => new Promise((resolve, reject) => {
  let content = '';
  process.stdin.resume();
  process.stdin.on('data', buf => content += buf.toString());
  process.stdin.on('end', () => {
    try {
      resolve(JSON.parse(content));
    } catch (e) {
      reject(e);
    }
  });
});

async function jsonStdout(val) {
  process.stdout.write(JSON.stringify(await val));
}

async function readConfig(config, MessagingApi) {
  const {
    source: { filter = '.*', telegram_key, flags },
    version
  } = await config;

  return {
    regex: new RegExp(filter, flags),
    api: new MessagingApi(telegram_key),
    version
  };
}

module.exports = {
  readFile,
  kv,
  jsonStdin,
  writeFile,
  jsonStdout,
  readConfig
};
