/*
  文件由 migrate 命令生成，具体参看 README.md
  知识点：

*/

'use strict'

var r = require('../011utils-rethinkdb')(), // notice () 
    config = require('../012config-rethinkdb')

exports.up = function(next) {
  r.dbCreate(config.rethink.db).run(next);
};

exports.down = function(next) {
  r.dbDrop(config.rethink.db).run(next);
};

