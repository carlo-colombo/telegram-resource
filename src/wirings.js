/* @flow */
const { apiFactory, request } = require('./api-telegram');
const { jsonStdin, readConfig: _readConfig } = require('./utils.js');

import type { Configuration, ReadConfiguration } from './types';

const readConfig: ReadConfiguration = async function(): Promise<Configuration> {
  return await _readConfig(jsonStdin(), apiFactory(request));
};

module.exports = {
  readConfig
};
