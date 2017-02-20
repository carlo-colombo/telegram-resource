/* @flow */
const Api = require('./api-telegram');
const path = require('path');

import type { Configuration, ReadConfiguration, Metadata } from './types';

async function main(
  readConfig: ReadConfiguration,
  readFile: Function,
  dest: string
): Promise<{ version: Object, metadata: Array<Metadata> }> {
  try {
    const {
      api,
      chat_id: chat_id_file,
      text: text_file
    } = await readConfig();

    const [chat_id, text]: [string, string] = await Promise.all([
      readFile(path.join(dest, chat_id_file)),
      readFile(path.join(dest, text_file))
    ]);

    const resp = await api.sendMessage(chat_id, text);
    const { result: { chat } } = resp;

    return {
      version: {},
      metadata: [
        kv('username', chat.username),
        kv('chat_id', chat.id.toString())
      ]
    };
  } catch (e) {
    console.error(e);
    return {
      version: {},
      metadata: []
    };
  }
}

module.exports = {
  main
};

const { kv, readFile, jsonStdout } = require('./utils.js');
const { readConfig } = require('./wirings.js');

if (require.main === module) {
  jsonStdout(main(readConfig, readFile, process.argv.pop()));
}
