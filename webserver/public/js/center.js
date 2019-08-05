const setUserInfo = () => {
  // 从 本地存储中拿出当前登录的用户信息，拿去修改页面相应的位置
  let userInfo = sessionStorage.getItem("userInfo");
  if (userInfo) {
    // 存在
    userInfo = JSON.parse(userInfo);
    $("#userInfo img").attr("src", userInfo.avatar);
    $("#userInfo span").html(userInfo.username);
  } else {
    // 不存在
    location.href = "/login.html";
  }
};

/**
 * 修改头像
 */
const updateAvatar = () => {
  // ！！！！！！！！
  // 1. 不想普通的ajax请求那样，直接传递 input val(),
  // 2. 需要的是这个文件的信息对象  dom.files[0] 文件信息对象
  // 3. ajax 需要做一下调整
  // console.log($("#myFile")[0].files[0]);
  let formData = new FormData();
  formData.append("avatar", $("#myFile")[0].files[0]);

  $.ajax({
    url: `${BaseURL}/api/user/update`,
    method: "POST",
    data: formData,
    headers: {
      AccessToken: sessionStorage.getItem("token")
    },
    processData: false,
    contentType: false,
    success: res => {
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      userInfo.avatar = res.data;
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
      location.reload();
    }
  });
};

$(function() {
  // 初始化个人信息
  setUserInfo();

  // 修改头像点击事件
  $("#myBtn").click(function() {
    // 判断是否选择了文件
    if ($("#myFile").val()) {
      // 可以修改头像了
      updateAvatar();
    }
  });
});
