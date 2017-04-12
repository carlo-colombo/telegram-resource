/*  */
const { apiFactory, request } = require('./api-telegram');
const { jsonStdin, readConfig: _readConfig } = require('./utils.js');


const readConfig = async function() {
  return await _readConfig(jsonStdin(), apiFactory(request));
};

module.exports = {
  readConfig
};
