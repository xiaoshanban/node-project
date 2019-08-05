/**
 * 后端接口实现
 */

// 1. 引包
const experss = require("express");
const server = experss();

// 引入拆分出去的路由文件
const userRouter = require("./routes/user");
const studentRouter = require("./routes/student");

// 中间件
server.use(experss.json());
server.use(experss.urlencoded({ extended: true }));

// 静态资源托管
server.use(experss.static("./public"));

// 前端 ajax 跨域设置
server.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "accesstoken");
  next();
});

// 2. 接口设置
server.use("/api", [userRouter, studentRouter]);

// 3. 监听 3000 端口
server.listen(3000);
