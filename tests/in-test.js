const { main } = require('../assets/in.js');
const { noop } = require('lodash');
const sinon = require('sinon');
const should = require('should');

describe('in', () => {
  describe('main', () => {
    describe('should return an empty object', () => {
      it('when readConfig throw an exception', async () => {
        const res = main(sinon.stub.throws(), noop, noop, noop);
        should(await res).be.eql({});
      });
      it('when jsonStdin throw an exception', async () => {
        const res = main(noop, sinon.stub.throws(), noop, noop);
        should(await res).be.eql({});
      });
      it('when Api throw an exception', async () => {
        const res = main(noop, noop, sinon.stub.throws(), noop);
        should(await res).be.eql({});
      });
      it('when check throw an exception', async () => {
        const res = main(noop, noop, noop, sinon.stub.throws());
        should(await res).be.eql({});
      });
      it('when writeFile throw an exception', async () => {
        const res = main(noop, noop, noop, noop, sinon.stub.throws());
        should(await res).be.eql({});
      });
    });

    describe('when updates are available', () => {
      const update = {
        message: { text: 'hi' },
        update_id: 42,
        chat: {
          username: 'carlo',
          id: 123
        }
      },
        version = { update_id: '42' };

      let check, readConfig;

      beforeEach(() => {
        check = sinon.stub().returns([update]);
        readConfig = sinon.stub().returns({ version });
      });

      it('returns the last update', async () => {
        const res = main(readConfig, noop, noop, check, noop, '');
        should(await res).be.eql({
          version,
          metadata: [
            { name: 'username', value: 'carlo' },
            { name: 'chat_id', value: '123' }
          ]
        });
      });

      it('call writeFile with the update as string', async () => {
        const writeFileMock = sinon.stub();
        const dest = '/a-file-path';
        const res = await main(
          readConfig,
          noop,
          noop,
          check,
          writeFileMock,
          dest
        );

        sinon.assert.calledWith(
          writeFileMock,
          `${dest}/message`,
          JSON.stringify(update)
        );
      });

      describe('but all the message are filtered out', () => {
        const _err = console.error;
        beforeEach(() => {
          console.error = sinon.spy();
        });
        it('returns an empty object', async () => {
          const res = main(readConfig, noop, noop, () => [], noop, '/path');
          should(await res).be.eql({});
          should(console.error.called).be.not.ok();
        });
        afterEach(() => {
          console.error = _err;
        });
      });
    });
  });
});
