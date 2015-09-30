
'use strict'

var r = require('../011utils-rethinkdb')(), // notice () 
    TABLE = 'users';

exports.up = function(next) {
  r.tableCreate(TABLE).run(next);
};

exports.down = function(next) {
  r.tableDrop(TABLE).run(next);
};
