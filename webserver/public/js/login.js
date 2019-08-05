// 登录 ajax 调用方法
const loginApi = (username, password) => {
  $.post(
    `${BaseURL}/api/sign-in`,
    {
      username,
      password
    },
    res => {
      if (res.code === 0) {
        // 登录成功，将当前的用户信息保存下来
        sessionStorage.setItem("userInfo", JSON.stringify(res.data.userInfo));
        // 把 token 也保存下来
        sessionStorage.setItem("token", res.data.token);

        alert("登录成功，欢迎");
        location.href = "/index.html";
      } else {
        alert(res.msg);
      }
    }
  );
};

//

$(function() {
  // 登录按钮点击事件
  $("#myBtn").click(function() {
    // 表单较小 - 非空校验
    let username = $('input[name="username"]').val();
    let password = $('input[name="password"]').val();

    if (!username || !password) {
      alert("请输入相关信息");
      return;
    }

    // 登录操作
    loginApi(username, password);
  });
});
