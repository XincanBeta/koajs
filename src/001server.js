/*
  知识点
  1、请求对象、响应对象已封装在 this 中
      区别于其他框架是从参数传入
  2、响应体可以是普通字符串、html字符串、对象、数组；
      响应体根据内会自动调整 Content-Type 值；
      this.body = this.response.body
  3、打印请求对象，了解其结构
      比如 url
  4、设置状态码
  5、写一个“计算耗时”中间件
      中间件的执行顺序是编码顺序
      通过 arguments 发现默认会给中间件传一个空对象，参数名默认取作 next
      next 与 yield 配合，作为 yield 的默认值
      理解 yield 是如何流转控制权的，想象穿透洋葱表面
  6、用 this.set 设置返回头属性
 */

var koa = require('koa');
var app = koa();
var router = require('koa-router');

var requestTime = function(headerName){
  return function* (next){
    console.log(next); // next 默认是个空对象
    var start = new Date;
    yield next;
    var end = new Date;
    var ms = end - start;
    this.set(headerName, ms + 'ms')
  }
}

app.use(requestTime('Response-time'))

app.use(function*() {
  // console.log("arguments", arguments);
  // console.log(this.request);
  var url = this.request.url;
  if (url === '/') {
    this.body = "hello superman"
  } else if (url === '/date') {
    this.body = new Date;
  } else {
    this.status = 404;
    this.body = "can\'t find!"
  }
});

app.listen(3000)

