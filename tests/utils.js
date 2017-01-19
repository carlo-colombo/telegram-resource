const should = require('should')
const {readConfig} = require('../assets/utils.js')
const sinon = require('sinon')


describe('utils', ()=>{
    describe('readConfig', ()=>{
        it('returns a regex matching filter and flag', async ()=> {
            const {regex} = await readConfig({
                source: {filter: "hello", flags: "gi"}
            }, sinon.spy())

            should(regex).be.eql(/hello/gi)
        })

        it('return the catchall regex if is not defined', async ()=>{
            const {regex} = await readConfig({
                source: {}
            }, sinon.spy())

            should(regex).be.eql(/.*/)
        })

        it('should instantiate MessagingApi with telegram_key', async ()=>{
            const MessagingApi = sinon.spy()
            await readConfig({
                source: {telegram_key: 'the-key'}
            }, MessagingApi)

            sinon.assert.calledWith(MessagingApi, 'the-key')
        })
    })
})
