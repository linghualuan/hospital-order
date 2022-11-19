import { request } from "../request/request"

Page({
  data: {
    result:'',
    agree:true,
    notice: ''
  },

  //扫描二维码
  onLoad(){

  },

  //微信授权
  handleIsAuthorization(){
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.getUserProfile({
        desc: '绑定用户的微信账号',
        success:res => {
          console.log(res);
          wx.setStorageSync('userInfo', res.userInfo);
          wx.navigateTo({
            url: '../order_project/order_project',
          })
        },
        fail:res => {
          wx.showToast({
            title: '您取消了授权,授权成功后才能继续使用',
            icon:'none'
          })
        }
      })
    }else{
      wx.navigateTo({
        url: '../order_project/order_project',
      })
    }
  },

  //扫码签到
  getScanCode() {
    wx.scanCode({
      success: (res) => {
        console.log(res)
        let relId = wx.getStorageSync('relId')
        let result = res.result.split('&')
        let authQrCode =  result[0]
        request({url:'/queue/signIn',data:{relId,authQrCode}})
        .then(
          res => {
            console.log(res);
            let msg = res.data.msg;
            wx.showToast({
              title: msg,
              icon:'none',
              duration: 2000
            })
          }
        )
      },
      fail:res => {
        console.log(res);
      }
    })
  },

  //点击同意
  handleAgree() {
    let agree = this.data.agree;
    agree = !agree;
    this.setData({agree})
    console.log(this.data.agree);
    let isAgree = true
    wx.setStorageSync('isAgree',isAgree)
    wx.getUserProfile({
      desc:'绑定用户的微信账号',
      success:res => {
        console.log(res);
        wx.setStorageSync('userInfo',res.userInfo);
        wx.showToast({
          title: '授权成功',
          icon:'none'
        })
      },
      fail:err => {
        wx.showToast({
          title:'您拒绝了授权,后续功能可能无法使用!',
          icon:'none'
        })
      }
    })
  },

  localCheck(number) {
    if(number === 's10001'){ //如果本地信息为超级管理员则跳转到超级管理员
    setTimeout(() => {
        wx.reLaunch({
            url:'/pages/super_index/super_index'
        })
    },0)
    }else if(number === 'n10002'){ //如果本地信息为预约护士则跳转到预约护士
        setTimeout(() => {
            wx.reLaunch({
                url: '/pages/nurse_order/nurse_order',
            })
        },0)
    }else if(number === 'n10003'){ //如果本地信息为注射护士则跳转到注射护士
        setTimeout(() => {
            wx.reLaunch({
                url: '/pages/nurse_injection/nurse_injection',
            })
        },0)
    }else if(number === 't10004'){ //如果本地信息为采集技师则跳转到采集技师
        setTimeout(() => {
            wx.reLaunch({
                url: '/pages/technician/technician',
            })
        },0)
    }
},


  //获取公告内容
  handleGetNotice() {
    request({url: '/serve/project/getAdvice'}).then(
      res => {
        let notice = res.data.data.messageText
        this.setData({notice})
      }
    )
  },

  onLoad(){
    //获取公告
    this.handleGetNotice()

    //若用户进入首页点击同意后则不再显示用户说明，否则弹出用户说明
    let isAgree = wx.getStorageSync('isAgree')
    if(isAgree){
      let agree = false;
      this.setData({agree})
    }else{
      let agree = true;
      this.setData({agree})
    }
    this.localCheck(wx.getStorageSync('medicalCard'))
  },

  onShow(){
    //页面左上角小房子消失
    wx.hideHomeButton()
  },
})
