/**
 * 用户相关的路由代码
 */
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const router = express.Router();
const UserModel = require("../models/user");
const auth = require("../middlewares/auth");
const fs = require("fs");
const path = require("path");

// 文件上传临时路径
const upload = multer({
  dest: "C:/tmp"
});

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
      // 密码正确，生成一个令牌
      const token = jwt.sign(
        {
          userId: data._id
        },
        "MY_GOD"
      );
      res.send({
        code: 0,
        msg: "登录成功",
        data: {
          userInfo: {
            userId: data._id,
            username: data.username,
            avatar: data.avatar
          },
          token: token
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

/**
 * 修改头像
 * POST /api/user/update
 */
router.post("/user/update", auth, upload.single("avatar"), (req, res) => {
  // 设置新文件名
  let newFileName = new Date().getTime() + "_" + req.file.originalname;
  // 设置新路径
  let newFilePath = path.resolve(__dirname, "../public", newFileName);
  // 读文件
  let data = fs.readFileSync(req.file.path);
  // 写入新路径
  fs.writeFileSync(newFilePath, data);

  // 文件操作完，还需要将当前用户的数据库给修改了，但需要当前用户的 id
  // 只需要，让这个接口 经过 auth 中间件的处理。 处理之后，就可使用 req.userInfo.userId
  UserModel.updateOne(
    {
      _id: req.userInfo.userId
    },
    {
      avatar: `http://localhost:3000/${newFileName}`
    }
  ).then(() => {
    res.send({
      code: 0,
      msg: "修改成功",
      data: `http://localhost:3000/${newFileName}`
    });
  });
});

// 暴露 router
module.exports = router;
