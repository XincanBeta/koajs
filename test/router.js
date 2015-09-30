/*
  知识点：
  1、

*/

'use strict';

let assert = require('assert'),
  request = require('co-supertest'),
  app = require('./fixtures/app'),
  escape = require('escape-html')

require('co-mocha')

let server = app.listen();

function testHelper(jadeFile, contains, doLog, data) {
  data = data || {}
  return request(server)
    .post('/')
    .set('jadeFile', jadeFile)
    .set('doLog', doLog)
    .send(data)
    .expect(200)
    .expect(contains)
    .end()
}

describe('Jade', function() {
  it('should contain href="knowthen.com" in response', function*() {
    yield testHelper('attr', /href="knowthen.com"/, false)
  })


})








