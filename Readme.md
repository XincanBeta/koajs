koajs tutorial 





src 文件组织结构是循序渐进

参考：https://www.youtube.com/watch?v=F8v9xFSrHi8

记录操作：
npm scripts 命令是基于根目录（package.json 所在层级），运行文件要带相应的路径

全局安装 migrate
sudo npm i -g migrate
例子：
// 在当前目录创建 migrations 文件夹和样板文件
// 在 src 目录下运行
migrate create add-database
migrate create add-user
思考：migrate 是什么啊！？

rethinkdb
在终端运行 rethinkdb
在浏览器打开 http://localhost:8080/#dataexplorer
cmd + enter 是 run 的快捷键

test/jade 目录在于 通过 mocha 练习 jade 语法

