/*
  知识点：
  1、正则表达式在测试中的运用，可以记忆正则语法
      此处是否包含的意思

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
  it('should render a passed variable', function*() {
    let name;
    name = 'li'
    yield testHelper('vars', new RegExp(name), false, {name: name})
  })
  it('should escape unsafe content', function *(){
    let userContent, escapeUserContent
    userContent = '<script>dangerousStuff</script>'
    escapeUserContent = escape(userContent)
    yield testHelper('vars', new RegExp(escapeUserContent), 
      false, {name:userContent})
  })
  it('should render a list of websites', function *(){
    let sites = ['knowthen.com', 'google.com', 'douban.com']
    yield testHelper('loop', new RegExp(sites[0]), false, {sites: sites})
    // yield testHelper('loop', new RegExp(sites[1]), true, {sites: sites})
    // yield testHelper('loop', new RegExp(sites[2]), true, {sites: sites})
  })
  it('should be ok to drive', function *(){
    yield testHelper('case', /able to drive/, false, {drinksConsumed: 0});
  })
  it('should show login link', function *(){
    yield testHelper('conditional', /login/, false)
  })
  it('should show logout link', function *(){
    yield testHelper('conditional', /logout/, false, {user: 'li'})
  })
  it('should show the regular comment', function *(){
    yield testHelper('comment', /should show/, false)
  })
  it('should not show the unbuffered comment', function *(){
    let message
    try{
      yield testHelper('comment', /should not show/, true)
    }catch(err){
      message = err.message
    }
    assert.equal(message, 
      "expected body '<!-- this comment should show-->'" + 
      " to match /should not show/")
  })
})












