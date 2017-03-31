const should = require('should');
const { check, main } = require('../src/out.js');
const sinon = require('sinon');
const { map, noop } = require('lodash');
const { kv } = require('../src/utils.js');

describe('out', () => {
  let readFile, sendMessage, readConfig;

  beforeEach(() => {
    readFile = sinon.stub();
    readFile.onCall(0).returns('42');
    readFile.onCall(1).returns('hello');
    sendMessage = sinon.stub().returns({
      result: { chat: { id: 42, username: 'carlo' } }
    });

    readConfig = sinon.stub().returns({
      api: { sendMessage },
      params: {
        chat_id: 'chat_id_file_path',
        text: 'text_file_path'
      }
    });
  });

  it('call the api to send a message', async () => {
    await main(readConfig, readFile, '/a/folder');

    sinon.assert.calledWith(sendMessage, '42', 'hello');
    sinon.assert.calledWith(readFile, '/a/folder/chat_id_file_path');
    sinon.assert.calledWith(readFile, '/a/folder/text_file_path');
  });

  it('returns some metadata', async () => {
    const res = main(readConfig, noop, '');

    should(await res).be.eql({
      version: {},
      metadata: [kv('username', 'carlo'), kv('chat_id', '42')]
    });
  });

  describe('should return an empty object', () => {
    let throwFn;
    const emptyResp = { version: {}, metadata: [] };

    beforeEach(() => {
      throwFn = sinon.stub().throws();
    });

    it('when readConfig return an error', async () => {
      const res = await main(throwFn, noop, '');
      sinon.assert.called(throwFn);
      should(res).be.eql(emptyResp);
    });

    it('when readFile return an error', async () => {
      const readFile = sinon.stub().throws();

      const res = await main(readConfig, readFile, '/a/path');
      sinon.assert.called(readFile);
      should(res).be.eql(emptyResp);
    });

    it('when sendMessage return an error', async () => {
      sendMessage = sinon.stub().throws();
      readConfig = sinon.stub().returns({
        api: { sendMessage },
        params: {
          chat_id: 'chat_id_file_path',
          text: 'text_file_path'
        }
      });

      const res = await main(readConfig, readFile, '/a/path');
      sinon.assert.called(sendMessage);
      should(res).be.eql(emptyResp);
    });
  });
});
