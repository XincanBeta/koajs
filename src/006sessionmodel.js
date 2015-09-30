/*
  知识点：
  1、练习 rethinkdb noSql 数据库
  2、练习 rethinkdbdash 是 rethinkdb 的驱动

*/
var dash = require('rethinkdbdash');

var DB_NAME = 'sessiondb';
var TABLE_NAME = 'session';
var TOKEN_FIELD_NAME = 'token';

var r = dash({
  db: DB_NAME
});

module.exports = {
  add: function* add(token, session) {
    session[TOKEN_FIELD_NAME] = token;
    return yield r.table(TABLE_NAME).insert(session).run();
  },
  findByToken: function* findByToken(token) {
    var filter, session, result;
    filter = {};
    filter[TOKEN_FIELD_NAME] = token;
    result = yield r.table(TABLE_NAME).filter(filter).run();
    if (result && result.length == 1) {
      session = result[0]
    };
    return session;
  },
  update: function* update(token, session) {
    var filter = {};
    session[TOKEN_FIELD_NAME] = token;
    filter[TOKEN_FIELD_NAME] = token;
    return yield r.table(TABLE_NAME).filter(filter).update(session).run();
  },
  remove: function* remove(token) {
    var filter = {};
    filter[TOKEN_FIELD_NAME] = token;
    return yield r.table(TABLE_NAME).filter(filter).delete().run();
  },
  tryMigrate: function* tryMigrate() {
    try {
      yield r.dbCreate(DB_NAME).run();
      yield r.tableCreate(TABLE_NAME).run();
      yield r.table(TABLE_NAME).indexCreate(TOKEN_FIELD_NAME)
    } catch (e) {

      console.log(e);
    }
  }
}
