/*  
  由 009 调用，配合 009 
  知识点：
  1、熟悉 lodash 工具，在 node 环境内不用考虑资源，推荐用工具包处理集合对象
  2、易错点：generator 函数与普通函数
      init 就是普通函数
      不能用普通方式调用 generator 函数，否则无法执行
*/
var _ = require('lodash'),
  r = require('./011utils-rethinkdb.js')(),
  bcrypt = require('co-bcryptjs')

var TABLE = 'users'
var SCHEMA = ['userName', 'password'];

var User = function(properties) {
  // console.log("user constructor");
  this.init();
  _.assign(this, properties)
}

User.prototype.hashPassword = function*() {
  // console.log("1");
  if (this.newPassword) {
    this.newPassword = false;
    var salt = yield bcrypt.genSalt(10)
    this.password = yield bcrypt.hash(this.password, salt)
    // console.log(this.password);
  };
}

User.prototype.init = function() {
  // console.log("init");
  Object.defineProperty(this, 'password', {
    get: function() {
      return this._password;
    },
    set: function(password) {
      this._password = password;
      this.newPassword = true;
      // console.log("set new password");
    }
  })
}

User.findByUserName = function*(userName) {
  var result, criteria, user;
  criteria = {}
  criteria.userName = userName;
  result = yield r.table(TABLE).filter(criteria).run();
  if (result && result.length === 1) {
    user = new User(result[0])
  };
  return user;
}

User.prototype.isPassword = function *(password){
  return yield bcrypt.compare(password, this.password);
}


User.prototype.save = function*() {
  var result, data;
  yield this.hashPassword();
  // console.log("2");
  data = _.pick(this, SCHEMA)
  if (this.id) {
    result = yield r.table(TABLE).get(this.id).update(data).run();
  } else {
    result = yield r.table(TABLE).insert(data).run();
    if (result && result.inserted == 1) {
      this.id = result.generated_keys[0]
    };
  }
}

module.exports = User;
