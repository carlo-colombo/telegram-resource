const should = require('should');
const { check, main } = require('../src/check.js');
const sinon = require('sinon');
const { map, noop } = require('lodash');

// console.error = ()=>{}

describe('check', () => {
  describe('with no message available', () => {
    it('returns an empty list', async () => {
      const res = check({
        getUpdates: () => ({ result: [] })
      });

      return should(await res).be.eql([]);
    });
  });

  describe('with messages available', () => {
    const mockApi = {
      getUpdates: () => ({
        result: [
          { message: { text: 'hi' }, update_id: 42 },
          { message: { text: 'not_hi' }, update_id: 43 }
        ]
      })
    };
    it('returns an update for each message available', async () => {
      const res = check(mockApi);

      should(map(await res, 'update_id')).be.eql([42, 43]);
    });

    describe('with a filter defined', () => {
      const filter = /not_hi/;

      it('filters out messages not matching the regex', async () => {
        const res = await check(mockApi, {}, filter);

        should(map(await res, 'update_id')).be.eql([43]);
      });

      it(
        'filters out messages not matching the regex, even all of them',
        async () => {
          const res = check(mockApi, {}, /asd/);

          should(await res).be.eql([]);
        }
      );
    });
  });

  describe('when version is defined', () => {
    it('should use it to call getUpdates', () => {
      const mockApi = {
        getUpdates: sinon.stub().returns({ result: [] })
      };

      check(mockApi, { update_id: '42' });

      sinon.assert.calledWith(mockApi.getUpdates, '42');
    });
  });

  describe('main', () => {
    describe('should return an empty array', () => {
      it('when readConfig throw an exception', async () => {
        const res = main(sinon.stub.throws(), noop, noop, noop);
        should(await res).be.eql([]);
      });
      it('when jsonStdin throw an exception', async () => {
        const res = main(noop, sinon.stub.throws(), noop, noop);
        should(await res).be.eql([]);
      });
      it('when Api throw an exception', async () => {
        const res = main(noop, noop, sinon.stub.throws(), noop);
        should(await res).be.eql([]);
      });
      it('when check throw an exception', async () => {
        const res = main(noop, noop, noop, sinon.stub.throws());
        should(await res).be.eql([]);
      });
    });

    describe('when updates are available', () => {
      it('return a list of updates', async () => {
        const check = sinon
          .stub()
          .returns([{ message: { text: 'hi' }, update_id: 42 }]);

        const res = main(sinon.stub().returns({}), noop, noop, check);
        should(await res).be.eql([{ update_id: '42' }]);
      });
    });
  });
});
