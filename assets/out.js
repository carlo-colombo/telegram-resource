const Api = require('./api-telegram');
const path = require('path');

async function main(readConfig, jsonStdin, Api, readFile, dest) {
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
  // try {
  //   // console.log('at least tryiing');
  //   // const {
  //   //   params: { chat_id: chat_id_file, text: text_file },
  //   //   source: { telegram_key }
  //   // } = await jsonStdin();

  //   // const api = new Api(telegram_key);

  //   // console.error('error', telegram_key);
  //   // const [chat_id, text] = await Promise.all([
  //   //   readFile(path.join(dest, chat_id_file)),
  //   //   readFile(path.join(dest, text_file))
  //   // ]);
  //   // console.error('error', chat_id, text);
  //   // // const {result: {chat}} = await api.sendMessage(chat_id, text)
  //   // console.error('error', resp);
  const { result: { chat } } = resp;

  return {
    version: {},
    metadata: [kv('username', chat.username), kv('chat_id', chat.id.toString())]
  };
  // } catch (e) {
  //   console.error(e);
  //   return {};
  // }
  return await null;
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
