/**
 * 配置 student 的表结构
 */

// 1. 引入已连接数据库的 js 模块
const db = require("../config/db");

// 2. 配置 schema 结构
const schema = new db.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    default: 18
  },
  sex: {
    type: Number,
    default: 1
  }
});

// 3. 暴露 model 对象
module.exports = db.model("student", schema);
