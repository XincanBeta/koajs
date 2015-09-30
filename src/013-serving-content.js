/*
  涉及到静态资源
  知识点：
  1、koa-static 是一种静态资源服务器
      静态资源的相对路径 是基于 运行命令时 所在的位置
      静态资源目录，默认叫做 public 
      PS：改动一下文件就报错  Internal Server Error
  2、__dirname 当前文件所在的绝对路径，当相对路径无法满足时，用绝对路径
  3、this.body 的返回类型 MIME，其中 stream-otect 就是文件或流，用 co-fs 组件
  4、
  5、

*/

var serve = require('koa-static');
var koa = require('koa');
var app = koa();

app.use(serve(__dirname + '/public'));

app.listen(3000)

