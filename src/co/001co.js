/*
  知识点：
  1、在 koa 练习中，让我对 yield 的交出控制权产生了疑惑
    koa 应该内置了 co
  2、co 模块用于 Generator 函数自动执行
  
*/

var co = require('co')

co(function* () {
  var result = yield Promise.resolve(true);
  return result;
}).then(function (value) {
  console.log(value);
}, function (err) {
  console.error(err.stack);
});







