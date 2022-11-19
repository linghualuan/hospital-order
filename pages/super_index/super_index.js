import { request } from '../request/request'
const App = getApp()
Page({
  data: {
    showQRcode: false,
    selectListUser: true,   //为true显示选择管理或患者选项，否则不显示
    adminQRCodeImg: false,    //为true显示管理程序码，否则显示患者程序码
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    isShowNotice: false,
    noticeInput: '',   //公告弹窗输入内容

    navHeight: "",
    nav: "",

    showUser: false,   //是否显示身份选择弹框
    userList: []
  },

  onClose() {
    this.setData({showUser: false})
  },

  showChangeUser() {
    let token = wx.getStorageSync('token')
    let relId = wx.getStorageSync("relId")
    request({url: "/login/changeRole",data: {token,relId},method: 'post',})
    .then(res=> {
        let userList = res.data.data
        this.setData({userList})
    })

    //显示身份选择
    this.setData({showUser: true})
  },


  //封装消除本地数据并更新数据函数
  handleRemoveUser(relId,medicalCard) {
    //消除原本存在的relId和medicalCard
    wx.removeStorageSync("relId");
    wx.removeStorageSync("medicalCard")
    //存储新的relId和medicalCard
    wx.setStorageSync("relId",relId)
    wx.setStorageSync("medicalCard",medicalCard)
  },

  //点击切换身份事件
  handleChangeUser(e) {
    let medicalCard = e.currentTarget.dataset.useritem.medicalCard
    let relId = e.currentTarget.dataset.useritem.relId
    if(medicalCard === 's10001') {
      this.handleRemoveUser(relId,medicalCard)
      wx.redirectTo({
        url: "../super_index/super_index",
        success: () => {
          setTimeout(() => {
            wx.showToast({
              title: "切换成功",
              icon: 'none'
            })
          },500)
        }
      })
    } else if(medicalCard === 'n10002') {
      this.handleRemoveUser(relId,medicalCard)
        wx.redirectTo({
          url: "../nurse_order/nurse_order",
          success: () => {
            setTimeout(() => {
              wx.showToast({
                title: "切换成功",
                icon: 'none'
              })
            },500)
          }
        })
    } else if(medicalCard === 'n10003') {
      this.handleRemoveUser(relId,medicalCard)
      wx.redirectTo({
        url: "../nurse_injection/nurse_injection",
        success: () => {
          setTimeout(() => {
            wx.showToast({
              title: "切换成功",
              icon: 'none'
            })
          },500)
        }
      })
    } else if(medicalCard === 't10004') {
      this.handleRemoveUser(relId,medicalCard)
      wx.reLaunch({
        url: "../technician/technician",
        success: () => {
          setTimeout(() => {
            wx.showToast({
              title: "切换成功",
              icon: 'none'
            })
          },500)
        }
      })
    }
  },

  //点击小程序码功能或者点击弹出框的叉号
  handleShowQRcode(){
    let showQRcode = this.data.showQRcode;
    showQRcode = !showQRcode;
    let selectListUser = true
    this.setData({showQRcode,selectListUser})
  },

  //保存管理端程序码
  handleClickAdminQRcode(){
    let fileName = new Date().valueOf()
    let filePath = wx.env.USER_DATA_PATH + "/" + fileName + '.jpg'
    wx.downloadFile({
      url:'https://xyeyyhyxk.top:8881/createCode/admin',
      filePath:filePath,
      success:res => {
        wx.saveImageToPhotosAlbum({
          filePath: filePath,
          success: (result)=>{
            wx.showToast({
              title: '保存成功',
            })
          },
        });
      }
    })
  },

  //保存患者端小程序码
  handleClickPatientQRcode() {
    let fileName = new Date().valueOf()
    let filePath = wx.env.USER_DATA_PATH + "/" + fileName + '.jpg'
    wx.downloadFile({
      url:'https://xyeyyhyxk.top:8881/createCode/patient',
      filePath:filePath,
      success:res => {
        wx.saveImageToPhotosAlbum({
          filePath: filePath,
          success: (result)=>{
            wx.showToast({
              title: '保存成功',
            })
          },
        });
      }
    })
  },

  //点击管理端程序码
  handleSelectAdmin() {
    let selectListUser = false
    let adminQRCodeImg = true
    this.setData({ selectListUser,adminQRCodeImg })
  },

  //点击患者端程序码
  handleSelectPatient() {
    let selectListUser = false
    let adminQRCodeImg = false
    this.setData({ selectListUser,adminQRCodeImg })
  },

  //弹窗页面的返回按钮
  handleBack() {
    let selectListUser = true
    this.setData({ selectListUser })
  },

  //获取公告信息
  handleGetNotice() {
    request({url: '/serve/project/getAdvice'}).then(
      res => {
        let noticeInput = res.data.data.messageText;
        this.setData({noticeInput})
      }
    )
  },

  //点击公告编辑
  handleEditNotice() {
    let isShowNotice = true;
    this.setData({isShowNotice})
  },

  //公告弹窗点击关闭按钮
  handleClose() {
    let isShowNotice = false
    this.setData({isShowNotice})
  },

  //公告弹出输入框事件
  handleNoticeInput(e) {
    this.setData({ noticeInput: e.detail.value})
  },

  //公告弹框点击确认
  handleSubmitNotice() {
    let noticeInput = this.data.noticeInput;
    if(noticeInput){
      request({url: '/superRoot/project/updateAdvice',data: {text: noticeInput},method: 'post'}).then(
        res => {
          if(res.data.code === 1) {
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 1500
            })
          }else {
            wx.showToast({
              title: '修改失败，请重试',
              icon: 'none',
              duration: 2000
            })
          }
        }
      )
        let isShowNotice = false
        this.setData({isShowNotice})
    }else {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1500
      })
    }

  },

  onLoad() {
    this.handleGetNotice()

    let navHeight = App.globalData.navHeight
    let nav = App.globalData.nav

    this.setData({
      navHeight,nav
    })
  },

  onShow(){
      //页面左上角小房子消失
      wx.hideHomeButton()

      this.setData({showUser: false})
  }
})
