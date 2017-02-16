/* @flow */
const Api = require('./api-telegram');
const { jsonStdin, readConfig: _readConfig } = require('./utils.js');

import type { Configuration, ReadConfiguration } from './types';

const readConfig: ReadConfiguration = async function(): Promise<Configuration> {
  return await _readConfig(jsonStdin(), Api);
};

module.exports = {
  readConfig
};
