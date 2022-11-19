import { request } from '../request/request'
const App = getApp()
Page({
    data: {
        userInfo:[],    //预约申请列表

        // userInfoPassed:[],  //已通过列表

        // userInfoUnpassed:[],     //未通过列表

        navHeight: "",

        nav: "",

        showUser: false,
        userList: [],
        genghuanShow: false,  //是否切换
        shaixuanShow: false,  //是否筛选
        selectCondition: [
          {
            id: 0,
            value: '预约申请',
            isActive: true,
            isShow: true
          },
          {
            id: 1,
            value: '已通过',
            isActive: false,
            isShow: false
          },
          {
            id: 2,
            value: '未通过',
            isActive: false,
            isShow: false
          }
        ],
 
        showDateSelect: '',  //是否显示日期选择、
        status: 0,  //筛选的状态
        date: "", // 用户选择的日期
        selectProject: '',   //用户筛选输入
        minDate: new Date(2022, 0, 1).getTime(),
        selectIndex: 0
    },



    //用户筛选输入
    getUserInput(e) {
      this.setData({
        selectProject: e.detail.value
      })
    },

    // 点击顶部更换项目按钮
    handleClickGenghuan() {
      this.setData({
        genghuanShow: true
      })
    },

    //点击顶部筛选按钮
    handleClickShaiXuan() {
      this.setData({
        shaixuanShow: true
      })
    },

    // 关闭筛选弹出框
    onCloseShaixaun() {
      this.setData({
        shaixuanShow: false
      })
    },

    // 关闭更换弹出框
    onCloseGengHuan() {
      this.setData({
        genghuanShow: false
      })
    },

    // 在筛选中点击状态的筛选条件
    clickItem(e) {
      let index = e.currentTarget.dataset.item.id
      let selectCondition = this.data.selectCondition
      selectCondition.forEach(v => {
        v.isActive = false
      })
      selectCondition[index].isActive = true
      let selectIndex = selectCondition[index].id
      this.setData({
        selectCondition,
        selectIndex
      })
      console.log('selectIndex',this.data.selectIndex);
    },

      //显示日期筛选
  showDateSelect() {
    this.setData({
      showDateSelect: true
    })
  },

  onCloseDate() {
    this.setData({
      showDateSelect: false
    })
  },

    // 用户点击日历确认
    onConfirmDate(e){
      let detail = e.detail
      let [year,month,day] = [detail.getFullYear(),detail.getMonth() + 1, detail.getDate()]
      this.setData({
        date: `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0'+day : day}`,
        showDateSelect: false
      })
      console.log(this.data.date);
    },

    //用户提交筛选条件
    submit() {
      this.handleUserInfo()
      this.setData({
        shaixuanShow: false,
        selectProject: '',
        date: ''
      })
    },

    // 获取用户数据
    handleUserInfo(){
      let date = this.data.date
      let status = this.data.selectIndex
      let project = this.data.selectProject
      request({url: '/infoCommit/ApplicationList', method: 'GET', data: {date, status, project}})
      .then(res => {
        console.log('res',res);
        let userInfo = res.data.data.records
        this.setData({ userInfo })
      })
    },

    // 用户搜索
    handleSearch(e) {
      if(e.detail) {
        request({
          url: '/infoCommit/searchApplicationList',
          data: {search: e.detail},
          method: 'GET'
        }).then(res => {
          console.log(res);
          this.setData({
            userInfo: res.data.data
          })
          console.log(this.data.userInfo);
        })
      }else {
        request({url: '/infoCommit/ApplicationList', method: 'GET'})
        .then(res => {
          console.log('res',res);
          let userInfo = res.data.data.records
          this.setData({ userInfo })
        })
      }
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

    onClose() {
        this.setData({showUser: false})
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
                title: "切换成功"
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
              title: "切换成功"
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
              title: "切换成功"
            })
          },500)
        }
      })
    }
  },

    handleQRCode(){
        wx.navigateTo({
            url: '../QRCodeImage/QRCodeImage'
        })
    },



    onLoad(){
        //页面刚加载时获取预约申请用户的数据
        this.handleUserInfo()
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
    },

    onPullDownRefresh(){
        this.handleUserInfo()
    }
})