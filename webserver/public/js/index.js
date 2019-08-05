// 定义数据
let curPageNum = 1; // 当前页码数
let curPageSize = 5; // 当前的每页显示条数

// 修改登录状态的方法
const setUserInfo = () => {
  //从 本地存储中拿出当前登录的用户信息，拿去修改页面相应的位置
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

// 登录校验的方法
const getStudentList = () => {
  //这个学生的接口需要做登录的校验，那么就要将 token 写入到请求头中。
  $.ajax({
    url: `${BaseURL}/api/student`,
    method: "GET",
    data: {
      pageNum: curPageNum,
      pageSize: curPageSize,
      searchName: $("#searchName").val()
    },
    headers: {
      // 自定义一个 AccessToken 的请求头，值是 token
      // 当我们自定义了请求头之后，那么 cors 跨域会出现问题
      AccessToken: sessionStorage.getItem("token")
    },
    success: res => {
      console.log(res);
      if (res.code === 0) {
        // 循环渲染分页的结构
        let totalPage = res.data.totalpage;
        let pageHtml = "";
        let prevPage = curPageNum - 1 > 1 ? curPageNum - 1 : 1; // 上一页的页码
        let nextPage = curPageNum + 1 > totalPage ? totalPage : curPageNum + 1;
        console.log(totalPage);

        pageHtml += `<li data-page="${prevPage}" class="lv-pagination__item prev">
        <a href="#"><i class="iconfont icon-doubleleft"></i></a>
      </li>`;
        for (let i = 1; i <= totalPage; i++) {
          pageHtml += `<li data-page="${i}" class="lv-pagination__item ${
            curPageNum === i ? "active" : ""
          }"><a href="#">${i}</a></li>`;
        }
        pageHtml += ` <li data-page="${nextPage}" class="lv-pagination__item next">
        <a href="#"><i class="iconfont icon-doubleright"></i></a>
      </li>`;
        $("#myPage").html(pageHtml);
      }
    }
  });
};

$(function() {
  setUserInfo();
  getStudentList();
  // 搜索点击事件
  $("#searchBtn").click(function() {
    curPageNum = 1;
    getStudentList();
  });
});
