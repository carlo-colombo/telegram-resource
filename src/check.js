const { jsonStdin, jsonStdout } = require('./utils');
const { readConfig } = require('./wirings');

async function check(api, version = {}, regex = /.*/) {
  const { update_id } = version || {};
  const { result } = await api.getUpdates(update_id);

  return result.filter(({ message: { text } }) => regex.test(text));
}

async function main(readConfig, check) {
  try {
    const { regex, api, version } = await readConfig();
    const res = (await check(api, version, regex)).map(({ update_id }) => ({
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
  jsonStdout(main(readConfig, check));
}
