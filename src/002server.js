/*
  知识点
  1、使用 koa-router 中间件
      如果不用路由中间件，原始写法是一个中间件包含了对 url 所有匹配
      用路由中间件，使得 url 匹配解耦拆分

 */

var koa = require('koa');
var app = koa();
var router = require('koa-router')();

// 路由配置
router.get('/', function* (){
  this.body = "hello superman";
})

router.get('/date', function* (){
  this.body = new Date;
})

// 注册路由
app
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(3000);
