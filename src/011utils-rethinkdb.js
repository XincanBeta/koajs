/*
  知识点：
  1、rethinkdbdash 是 rethinkdb 的 driver

*/

var dash = require('rethinkdbdash')
    config = require('./012config-rethinkdb')

var r ;

module.exports = function(options){
  if (!r) {
    options = options || config.rethink;
    r = dash(options);
  };
  return r;
}

