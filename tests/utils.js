const should = require('should')
const {readConfig} = require('../assets/utils.js')
const sinon = require('sinon')


describe('utils', ()=>{
    describe('readConfig', ()=>{
        it('returns a regex matching filter and flag', async ()=> {
            const {regex} = await readConfig({
                source: {filter: "hello", flags: "gi"}
            }, sinon.spy())

            should(regex.flags).be.eql('gi')
            should(regex.source).be.eql('hello')
        })

        it('return the catchall regex if is not defined', async ()=>{
            const {regex} = await readConfig({
                source: {}
            }, sinon.spy())

            should(regex.flags).be.eql('')
            should(regex.source).be.eql('.*')
        })
    })
})
