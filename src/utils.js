/* @flow */
const fs = require('fs');

import type { ConcourseConfiguration, Configuration } from './types';

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

function kv(name: string, value: any): { name: string, value: string } {
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

async function readConfig(
  config: Promise<ConcourseConfiguration> | ConcourseConfiguration,
  MessagingApi: Function
): Promise<Configuration> {
  const {
    source: { filter = '.*', telegram_key, flags },
    version,
    params
  } = await config;

  return {
    regex: new RegExp(filter, flags),
    api: new MessagingApi(telegram_key),
    version,
    params
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
