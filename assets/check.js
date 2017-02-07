const { jsonStdin, jsonStdout, readConfig } = require('./utils');
const Api = require('./api-telegram.js');

async function check(api, version = {}, regex = /.*/) {
  const { update_id } = version || {};
  const { result } = await api.getUpdates(update_id);

  return result.filter(({ message: { text } }) => regex.test(text));
}

function main(readConfig, jsonStdin, Api, check) {
  try {
    const { regex, api, version } = readConfig(jsonStdin(), Api);
    const res = check(api, version, regex).map(({ update_id }) => ({
      update_id: update_id.toString()
    }));

    return res;
  } catch (e) {
    console.error('error', e);
    return [];
  }
}

module.exports = {
  check,
  main
};

if (require.main === module) {
  jsonStdout(main(readConfig, jsonStdin, Api, check));
}
