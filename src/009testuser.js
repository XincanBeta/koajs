/*
  这部分暂时与 koa 无关，用于练习 model 和 rethinkdb
  知识点：
  1、编写测试文件，测试我们写的 model
      每个测试（it）都是独立的
  2、思考：使用 yield 的时机？
  3、引入 co-bcryptjs ，对密码进行 hash

*/
var assert  = require('assert'); // 依赖 mocha
    User    = require('./010modeluser'),
    r       = require('./011utils-rethinkdb')({db: 'test'})
require('co-mocha');

describe('User Model testing', function(){
  beforeEach(function *(){
    yield r.table('users').delete().run();
  })
  it('Should create a user', function *(){
    var user = new User();
    assert.equal(typeof user, 'object');
  })
  it('Should store properties passed when instantiated', function *(){
    var userName, user;
    userName = 'li';
    user = new User({userName, userName})
    assert.equal(user.userName, userName);
  })
  it('Should assign an id after being saved', function *(){
    var userName, password, user;
    userName = 'li'
    password = 'secret'
    var user = new User({userName: userName, password: password})
    yield user.save()
    assert(user.id) // 默认与 true 比较
  })
  it('Should find a saved user by userName', function *(){
    var user, foundUser, userName, password;
    userName = 'li';
    password = 'secret';
    user = new User({userName: userName, password: password})
    yield user.save()
    foundUser = yield User.findByUserName(userName)
    assert.equal(foundUser.userName, userName);
  })
  it('Should have a hashed password after being saved', function *(){
    var user, userName, password;
    userName = 'li';
    password = 'secret';
    user = new User({userName: userName, password: password})
    yield user.save()
    // console.log("------");
    assert.notEqual(user.password, password);
  })
  it('Should validate a correct password', function *(){
    var user, userName, password;
    userName = 'li';
    password = 'secret';
    user = new User({userName: userName, password: password})
    yield user.save()
    assert(yield user.isPassword(password))
  })
  it('Should not validate a incorrect password', function *(){
    var user, userName, password;
    userName = 'li';
    password = 'secret';
    user = new User({userName: userName, password: password})
    yield user.save()
    assert(!(yield user.isPassword('wrongpassword')))
  })

})





