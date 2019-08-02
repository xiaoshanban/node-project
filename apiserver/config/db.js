/**
 *连接数据库模块
 */

// 1. 引入 mongoose 模块
const mongoose = require("mongoose");

// 2. 连接数据库地址
const url = "mongodb://127.0.0.1:27017/node-admin";

// 3. 连接数据库
mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log("数据库连接成功");
  })
  .catch(error => {
    console.log("数据库连接失败");
    console.log(error);
  });

// 4. 暴露 mongoose 模块
module.exports = mongoose;
