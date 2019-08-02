/**
 * 配置 user 的表结构
 */

// 1. 引入已连接数据库的 js 模块
const db = require("../config/db");

// 2. 配置 schema 结构
const schema = new db.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: "http://localhost:3000/hero.jpg"
  }
});

// 3. 暴露 model 对象
module.exports = db.model("user", schema);
