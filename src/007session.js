/*
  对 005session 代码重构，
  知识点：
  1、将 session 改存于 rethinkdb 中
  2、加深对 yield 理解：
      发现只有 yield next 才是交出控制权
*/

var _ = require('lodash');
  uid = require('uid-safe');
  model = require('./006sessionmodel')

module.exports = function(options) {
  var store = {};
  var cookieName = 'koa.sid';
  var cookieOptions = {
    httpOnly: true,
    path: '/',
    overwrite: true,
    signed: true, // 让签名（keys）有效
    maxAge: 24 * 60 * 60 * 1000
  };

  var isMigrated = false;

  function *loadSession(ctx){
    // 查看并获取 session
    var token = ctx.cookies.get(cookieName);
    if (token) {
      // ctx.session = store[token];
      ctx.session = yield model.findByToken(token);
    };
    // 临时初始化 session
    if (!ctx.session) {
      ctx.session = {};
    };
  }

  function *saveSession(ctx, token){
    var isNew = false;
    if (!token) {
      isNew = true;
      token = yield uid(24);
      ctx.cookies.set(cookieName, token, cookieOptions);
      if (ctx.session) {
        // store[token] = ctx.session; 
        if (isNew) {
          yield model.add(token, ctx.session)
        }else{
          yield model.update(token, ctx.session)
        }
      };
    }
    if (!ctx.session) {
      // delete store[token]; 
      yield model.remove(token)
    };
    return token;
  }

  return function *session(next) {
    if (!isMigrated) {
      console.log("yield flow: 1")
      yield model.tryMigrate();
      console.log("yield flow: 2")
      isMigrated = true;
    };
    console.log("yield flow: 3")
    var token = yield loadSession(this)
    console.log("yield flow: 4")
    yield next; // 不能省略；只有这个 yield 交出了控制权
    console.log("yield flow: 7")

    yield saveSession(this, token)
    
  }
}
