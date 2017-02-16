/* @flow */
const Api = require('./api-telegram');
const { jsonStdin, readConfig } = require('./utils.js');

import type { Configuration, ReadConfiguration } from './types';

module.exports = {
  readConfig: async function(): Promise<Configuration> {
    return await readConfig(jsonStdin(), Api);
  }
};
