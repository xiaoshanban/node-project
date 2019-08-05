/**
 * student 路由设置
 */

// 1. 引包
const express = require("express");
const auth = require("../middlewares/auth");

// 路由器
const router = express.Router();

// 引入 student 的 model 对象
const StudentModel = require("../models/student");

// 2. 设置路由

/**
 * 学生查询
 * GET /api/student
 */
router.get("/student", auth, async (req, res) => {
  // 获取前端传递过来的参数
  let pageNum = parseInt(req.query.pageNum) || 1;
  let pageSize = parseInt(req.query.pageSize) || 5;
  let searchName = req.query.searchName;

  // 模糊搜索
  searchName = new RegExp(searchName);

  // 计算总页数
  let num = await StudentModel.find({ name: searchName }).count();
  let totalpage = Math.ceil(num / pageSize);

  // 查询数据返回前端
  let studentList = await StudentModel.find({ name: searchName })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize);

  // 返回数据
  res.send({
    code: 0,
    msg: "ok",
    data: {
      list: studentList,
      totalpage
    }
  });
});

/**
 * 学生添加
 * POST /api/student
 */
router.post("/student", async (req, res) => {
  // 获取前端参数并添加
  let student = new StudentModel(req.body);
  try {
    await student.save();
    res.send({
      code: 0,
      msg: "添加成功"
    });
  } catch (error) {
    res.send({
      code: -1,
      msg: error.message
    });
  }
});

// 3. 暴露 router
module.exports = router;
