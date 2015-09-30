/*
  对 004session 代码重构
  知识点：
  1、引入 ctx 概念，其实就是 this，观察是如何传入 ctx 的
  2、思考：当一个 generator 函数中有多个 yield 时，中间件如何流转？
      参考 test yield flow 注释
    当 yield 后跟 generator 函数
      yeild generator() 不会交出控制权；
      需要用 yeild *generator() 调用才会交出控制权
    用哪种视需求而定
  3、这个例子是将 session 存储于内存中

*/

var _ = require('lodash');
  uid = require('uid-safe');

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

  function *loadSession(ctx){
    // 查看并获取 session
    var token = ctx.cookies.get(cookieName);
    if (token && _.has(store, token)) {
      ctx.session = store[token];
    };
    // 临时初始化 session
    if (!ctx.session) {
      ctx.session = {};
    };
  }

  function *saveSession(ctx, token){
    // 真正初始化 session
    if (!token) {
      token = uid(24);
      ctx.cookies.set(cookieName, token, cookieOptions);
      if (ctx.session) {
        store[token] = ctx.session; // sessionid 与 session 绑定
      };
    }
    if (!ctx.session) {
      delete store[token]; // 只是删除 store 对象属性
    };
    return token;
  }

  return function *session(next) {
    // console.log("test yield flow: a");
    var token = yield loadSession(this)
    // console.log("test yield flow: b");
    yield next; // 不能省略；只有这个 yield 交出了控制权
    // console.log("test yield flow: d");
    yield saveSession(this, token)
    // console.log("test yield flow: e");
  }
}
