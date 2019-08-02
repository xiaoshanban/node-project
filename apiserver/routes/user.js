/**
 * 用户相关的路由代码
 */
const express = require("express");
const bcryptjs = require("bcryptjs");
const router = express.Router();
const UserModel = require("../models/user");

/**
 * 注册
 * POST /api/sign-up
 */
router.post("/sign-up", async (req, res) => {
  // 获取前端参数
  let username = req.body.username;
  let password = req.body.password;

  // 查询数据库中是否已注册
  let data = await UserModel.find({ username });
  // data 是一个数组，根据 data 的长度做判断
  if (data.length > 0) {
    // 用户已存在
    res.send({
      code: -1,
      msg: "用户名已存在"
    });
  } else {
    // 不存在
    // 先将密码做加密处理
    let newPassword = bcryptjs.hashSync(password, 10);

    // 写入数据库
    let user = new UserModel({
      username,
      password: newPassword
    });
    try {
      await user.save();
      res.send({
        code: 0,
        msg: "注册成功"
      });
    } catch (error) {
      res.send({
        code: -1,
        msg: error.message
      });
    }
  }
});

/**
 * 登录
 * POST /api/sign-in
 */
router.post("/sign-in", async (req, res) => {
  // 获取前端参数
  let username = req.body.username;
  let password = req.body.password;

  // 查询用户名是否存在
  let data = await UserModel.findOne({ username });
  if (data) {
    // 说明存在，校验密码
    if (bcryptjs.compareSync(password, data.password)) {
      // 密码正确
      res.send({
        code: 0,
        msg: "登录成功",
        data: {
          userId: data._id,
          username: data.username,
          avatar: data.avatar
        }
      });
    } else {
      // 密码错误
      res.send({
        code: -1,
        msg: "密码错误"
      });
    }
  } else {
    // 用户名不存在
    res.send({
      code: -1,
      msg: "用户名错误"
    });
  }
});

// 暴露 router
module.exports = router;
