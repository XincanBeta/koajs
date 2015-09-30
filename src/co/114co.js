/*
  知识点：
  1、co 解决 generator 的自动执行
  2、原生的 generator 允许 yield 原始值，
      但是 co 报错：You may only yield a function, promise, generator, array, or object


*/

var co = require('co');

co(function* () {
  var arr = []
  var res ;
  
  arr.push(yield wait_1) 
  console.log('arr', arr);

  arr.push(yield {b:2})
  console.log('arr', arr);

  arr.push(yield {c:3})
  console.log('arr', arr);
  
}).catch(onerror);

function wait_1(){
  /*setTimeout(function(){
    return {a: 1}
  }, 1000);*/

  return {a: 1}
}



function onerror(err) {
  // log any uncaught errors
  // co will not throw any errors you do not handle!!!
  // HANDLE ALL YOUR ERRORS!!!
  console.error(err.stack);
}

