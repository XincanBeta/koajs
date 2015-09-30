/*
  测试 jade， 由 test/jade.js 调用
  知识点：
  1、co-view 相当于模板框架
  2、get 获取参数时讲会将布尔值转为字符值
  
*/

'use strict';

let koa = require('koa'),
    views = require('co-views'), 
    parse = require('co-body'),
    html = require('html'),
    colors = require('colors')

let app = koa()

let render = views(__dirname + '/jade/', {default: 'jade'})

function log(content){
  content = html.prettyPrint(content, {indent_size: 2})
  console.log(content.blue.bgWhite);
}

app.use(function *controller(){
  let fileName, data, body, doLog;

  fileName = this.get('jadeFile')
  doLog = this.get('doLog') // boolean 会转为字符值
  data = yield parse(this)

  body = yield render(fileName, data)

  if (doLog == 'true') {
    log(body)
  };
  this.body = body

})

module.exports = app;



