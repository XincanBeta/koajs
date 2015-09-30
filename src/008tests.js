/*
  基于 003tests.js
  知识点
  1、运行 007session 会话中间件

 */

var app = require('koa')();
request = require('co-supertest');
session = require('./007session');
require('co-mocha');

// cookie key
app.keys = ['secret key here'];

app.use(session());

app.use(function*() {
  console.log("yield flow: 5")
  switch (this.request.url) {
    case '/setname':
      this.session.userName = 'li';
      this.body = this.session.userName;
      break;
    case '/getname':
      this.body = this.session.userName;
      break;
    case '/clear':
      this.session = null;
      this.status = 204; // 没有内容
      break;
  }
  console.log("yield flow: 6")
})

var server = app.listen();

describe('Testing rethinkDB middleware', function() {
  describe('Set Session Value', function() {
    var agent; 
    before(function*() {
      agent = request.agent(server);
    })
    it('Should set name in session object', function*() {
      yield agent.get('/setname').expect(200).end();
    })
  })

  describe('Retrieve Session Value', function() {
    var agent;
    before(function*() {
      agent = request.agent(server);
      yield agent.get('/setname').expect(200).end();
    })
    it('Should find the userName in the session', function*() {
      yield agent.get('/getname').expect('li').end();
    })
  })

  describe('Destory Session', function(){
    var agent;
    before(function *(){
      agent = request.agent(server);
      yield agent.get('/setname').expect(200).end();
    });
    it('Should not find session userName', function *(){
      yield agent.get('/getname').expect('li').end();
      yield agent.del('/clear').expect(204).end();
      yield agent.get('/getname').expect('').end();
    });
  });
});














