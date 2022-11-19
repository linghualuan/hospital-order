App({
  onLaunch() {
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("code:" + res.code);
        wx.request({
          url: "https://xyeyyhyxk.top:8881/login/up",
          data: { code: res.code },
          method: "get",
          success: (res) => {
            console.log(res);
            console.log("token:" + res.data.data);
            wx.setStorageSync("token", res.data.data);
          },
        });
      },
    });

    let menuButtonObject = wx.getMenuButtonBoundingClientRect();

    wx.getSystemInfo({
      success: (res) => {
        //导航栏高度(包含顶部时间和电量)
        let navHeight = menuButtonObject.top + menuButtonObject.height + (menuButtonObject.top - res.statusBarHeight)*2
        //导航栏高度(不包含顶部时间和电量)
        let nav = navHeight - res.statusBarHeight
        //把数值存进全局变量
        this.globalData.navHeight = navHeight
        this.globalData.nav = nav
      },
    });


  },
  globalData: {
    userInfo: null
  }
});
