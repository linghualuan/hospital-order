Page({

    data: {
        userInfo:{}
    },

    handleUserLoad(){
        wx.getUserProfile({
            desc:"绑定用户卡号",
            success:(res) => {
                console.log(res);
                const userInfo = res.userInfo;
                wx.setStorageSync("userInfo", userInfo);
                wx.navigateTo({
                  url: '../date/date'
                })
            },
            fail:(res) => {
                console.log("用户拒绝授权");
            }
        })
    },

    // onShow(){
    //     //页面左上角小房子消失
    //     wx.hideHomeButton()
    // }
})