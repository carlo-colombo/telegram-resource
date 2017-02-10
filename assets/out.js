const Api = require('./api-telegram');
const path = require('path');

async function main(readConfig, jsonStdin, Api, readFile, dest) {
  try {
    const {
      api,
      chat_id: chat_id_file,
      text: text_file
    } = await readConfig(jsonStdin(), Api);

    const [chat_id, text] = await Promise.all([
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
    return {};
  }
}

module.exports = {
  main
};

const { kv, readFile, jsonStdin } = require('./utils.js');

if (require.main === module) {
  jsonStdout(
    main(readConfig, jsonStdin, Api, check, writeFile, process.argv.pop())
  );
}
