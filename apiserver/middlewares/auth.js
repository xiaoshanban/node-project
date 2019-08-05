// 这个 js 文件是对 token 做校验的中间件函数
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  // 1. 获取到 req 请求头中的 accesstoken
  let token = req.get("accesstoken");
  // 2. 判断 token 是否存在
  if (!token) {
    // 不存在，就不允许访问，没有权限访问，直接返回信息
    // 401 - 验证不通过
    // 403 - 没有权限访问，不允许访问
    res.status(403).send("不允许访问");
  } else {
    // 存在还需要校验合法性
    jwt.verify(token, "MY_GOD", (err, data) => {
      if (err) {
        res.status(401).send("身份验证失败");
      } else {
        // 校验通过，可以请求数据
        // 后续的代码可能需要用到存在 token 中的数据 （payload）,为了省去后续中再次调用 verify 。可以在这个时刻，将 payload 信息，给写到 req 对象上。
        req.userInfo = data; // { userId: xxx }
        next();
      }
    });
  }
};
