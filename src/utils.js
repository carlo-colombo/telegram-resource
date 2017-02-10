/* @flow */
const fs = require('fs');

function readFile(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function writeFile(file: string, content: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function kv(name: string, value: string): { name: string, value: string } {
  return {
    name,
    value: value.toString()
  };
}

const jsonStdin = () => new Promise((resolve, reject) => {
  let content: string = '';
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

async function jsonStdout(val: any): Promise<any> {
  process.stdout.write(JSON.stringify(await val));
}

async function readConfig(config: Object, MessagingApi: Function) {
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
