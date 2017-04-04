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
      params: {
        chat_id: chat_id_file,
        text: text_file,
        message: message_file_path
      }
    } = await readConfig();

    let resp;
    if (message_file_path) {
      const message = await readFile(path.join(dest, message_file_path));
      resp = await api.sendFullMessage(JSON.parse(message));
    } else {
      const [chat_id, text]: [string, string] = await Promise.all([
        readFile(path.join(dest, chat_id_file)),
        readFile(path.join(dest, text_file))
      ]);

      resp = await api.sendMessage(chat_id, text);
    }

    const { result: { chat } } = resp;

    return {
      version: {},
      metadata: [
        kv('username', chat.username),
        kv('chat_id', chat.id.toString())
      ]
    };
  } catch (e) {
    console.error('error', e);
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
