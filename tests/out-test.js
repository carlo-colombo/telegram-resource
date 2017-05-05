const should = require('should')
const { check, main } = require('../src/out.js')
const sinon = require('sinon')
const { map, noop } = require('lodash')
const { kv } = require('../src/utils.js')

describe('out', () => {
  let readFile, sendMessage, readConfig

  beforeEach(() => {
    readFile = sinon.stub()
    readFile.onCall(0).returns('42')
    readFile.onCall(1).returns('hello')
    sendMessage = sinon.stub().returns({
      result: { chat: { id: 42, username: 'carlo' } }
    })

    readConfig = sinon.stub().returns({
      api: { sendMessage },
      params: {
        chat_id: 'chat_id_file_path',
        text: 'text_file_path',
        options: {
          parse_mode: 'Markdown'
        }
      }
    })
  })

  it('call the api to send a message', async () => {
    await main(readConfig, readFile, '/a/folder')

    sinon.assert.calledWith(sendMessage, '42', 'hello', {
      parse_mode: 'Markdown'
    })
    sinon.assert.calledWith(readFile, '/a/folder/chat_id_file_path')
    sinon.assert.calledWith(readFile, '/a/folder/text_file_path')
  })

  it('returns some metadata', async () => {
    const res = main(readConfig, noop, '')

    should(await res).be.eql({
      version: {},
      metadata: [kv('username', 'carlo'), kv('chat_id', '42')]
    })
  })

  describe('should return an empty object', () => {
    let throwFn
    const emptyResp = { version: {}, metadata: [] }

    beforeEach(() => {
      throwFn = sinon.stub().throws()
    })

    it('when readConfig return an error', async () => {
      const res = await main(throwFn, noop, '')
      sinon.assert.called(throwFn)
      should(res).be.eql(emptyResp)
    })

    it('when readFile return an error', async () => {
      const readFile = sinon.stub().throws()

      const res = await main(readConfig, readFile, '/a/path')
      sinon.assert.called(readFile)
      should(res).be.eql(emptyResp)
    })

    it('when sendMessage return an error', async () => {
      sendMessage = sinon.stub().throws()
      readConfig = sinon.stub().returns({
        api: { sendMessage },
        params: {
          chat_id: 'chat_id_file_path',
          text: 'text_file_path'
        }
      })

      const res = await main(readConfig, readFile, '/a/path')
      sinon.assert.called(sendMessage)
      should(res).be.eql(emptyResp)
    })
  })

  describe('can handle a full message', () => {
    const message = {
      chat_id: '42',
      text: 'hallo',
      parse_mode: 'markdown'
    }

    let sendFullMessage

    beforeEach(() => {
      readFile = sinon.stub().returns(JSON.stringify(message))
      sendFullMessage = sinon.stub().returns({
        result: { chat: { id: 42, username: 'carlo' } }
      })
    })

    it('call the api with the message', async () => {
      readConfig = sinon.stub().returns({
        api: { sendFullMessage },
        params: {
          message: 'message_file_path'
        }
      })

      const res = await main(readConfig, readFile, '/a/path')

      sinon.assert.calledWith(readFile, '/a/path/message_file_path')
      sinon.assert.calledWith(sendFullMessage, message)
    })

    it('it gives priority to a full message over chat_id/text', async () => {
      readConfig = sinon.stub().returns({
        api: { sendFullMessage },
        params: {
          chat_id: 'chat_id_file_path',
          text: 'text_file_path',
          message: 'message_file_path'
        }
      })

      const res = await main(readConfig, readFile, '/a/path')

      sinon.assert.calledWith(readFile, '/a/path/message_file_path')
      sinon.assert.calledWith(sendFullMessage, message)
    })
  })
})
