/*
  由 上一个 test 文件调用
  知识点
  1、编写 “seesion 会话管理”中间件

*/

var _ = require('lodash');
  uid = require('uid-safe'); // sessionid 生成器


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

  return function* session(next) {
    // 查看并获取 session
    var token = this.cookies.get(cookieName);
    if (token && _.has(store, token)) {
      this.session = store[token];
    };
    // 临时初始化 session
    if (!this.session) {
      this.session = {};
    };
    
    yield next;
    // 真正初始化 session
    if (!token) {
      token = uid(24);
      this.cookies.set(cookieName, token, cookieOptions);
      if (this.session) {
        store[token] = this.session; // sessionid 与 session 绑定
      };
    }
    if (!this.session) {
      delete store[token]; // 只是删除 store 对象属性
    };
  }
}
