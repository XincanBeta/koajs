/*
  知识点
  1、编写中间件 ”session 管理“ （在 004session.js、005session.js）
      自定义模块总是要用路径标识
  2、测试先行，编写测试代码
  3、必须用 mocha 命令执行测试
  4、mocha expect 如何运作的？
 */

var app = require('koa')();
request = require('co-supertest');
// session = require('./004session');
session = require('./005session');
require('co-mocha');

// cookie key
app.keys = ['secret key here'];

app.use(session());

app.use(function*() {
  switch (this.request.url) {
    case '/setname':
      // console.log("test yield flow: c");
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
})

var server = app.listen();

describe('Testing rethinkDB middleware', function() {
  describe('Set Session Value', function() {
    var agent; // 测试执行，agent 相当于 browser client
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














