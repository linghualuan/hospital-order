import { request } from '../request/request'
const App = getApp()
Page({
    data: {
        userInfo:[],
        navHeight: "",
        nav: "",
        showUser: false,
        userList: [],
        selectShow: false,  //是否显示筛选框
        selectCondition: [
          {
            id: 0,
            value: '未检查',
            isActive: true,
            isShow: true
          },
          {
            id: 1,
            value: '检查成功',
            isActive: false,
            isShow: false
          },
          {
            id: 2,
            value: '检查失败',
            isActive: false,
            isShow: false
          },
          // {
          //   id: 3,
          //   value: '取消检查',
          //   isActive: false,
          //   isShow: false
          // }
        ],
        showDateSelect: false,  //是否显示日期筛选
        date: "",    //用户选择的日期
        status: 0,    //筛选的状态
        selectProject: '',   //用户筛选输入项目名称
        status: 0,
        minDate: new Date(2022, 0, 1).getTime(),
    },

    // 用户搜索
    handleSearch(e) {
      if(e.detail) {
        request({
          url: '/technician/searchScanList',
          data: {search: e.detail},
          method: 'GET'
        }).then(res => {
          console.log(res);
          this.setData({
            userInfo: res.data.data
          })
        })
      }else {
        request({ url: '/technician/chooseScanList', method: 'GET' })
        .then(res => {
          this.setData({ userInfo: res.data.data.records })
        })
      }
    },

    //用户筛选输入
    getUserInput(e) {
      this.setData({
        selectProject: e.detail.value
      })
    },

    // 关闭筛选弹出层
    onCloseSelect() {
      this.setData({
        selectShow: false
      })
    },

    // 显示筛选
    showSelectPopup() {
      this.setData({
        selectShow: true
      })
    },
    //显示日期筛选
    showDateSelect() {
      this.setData({
        showDateSelect: true
      })
    },
    //关闭日期筛选
    onCloseDate() {
      this.setData({
        showDateSelect: false
      })
    },
    // 用户点击日历确认
    onConfirmDate(e){
      let detail = e.detail
      let [year,month,day] = [detail.getFullYear(),detail.getMonth() + 1, detail.getDate()]
      console.log(`${year}-${month}-${day}`);
      this.setData({
        date: `${year}-${month < 10 ? '0'+month : month}-${day < 10 ? '0'+day : day}`,
        showDateSelect: false
      })
    },
    //切换筛选状态 
    clickItem(e) {
      let index = e.currentTarget.dataset.item.id
      let selectCondition = this.data.selectCondition
      selectCondition.forEach(v => {
        v.isActive = false
      })
      selectCondition[index].isActive = true
      let status = selectCondition[index].id
      this.setData({
        selectCondition,
        status
      })
    },

    //用户提交筛选条件
    submit() {
      this.handleUserInfo()
      this.setData({ selectShow: false, date: '', selectProject: ''})
      console.log('order',this.data.status);
    },

    //获取用户信息
    handleUserInfo() {
      let date = this.data.date
      let status = this.data.status
      let project = this.data.selectProject
      request({url: '/technician/chooseScanList', method: 'GET', data: {date, status, project}})
      .then(res => {
        console.log('res', res);
        let userInfo = res.data.data.records
        this.setData({ userInfo })
      })
    },
    

    showChangeUser() {
        let token = wx.getStorageSync('token')
        let relId = wx.getStorageSync("relId")
        request({url: "/login/changeRole",data: {token,relId},method: 'post',})
        .then(res => {
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

    // handleItemTabChange(e){
    //     let index = e.detail;
    //     let tabs = this.data.tabs;
    //     tabs.forEach((v,i)=>{ i === index?v.isActive=true:v.isActive=false })
    //     this.setData({ tabs })
    //     if(index === 0){
    //         this.handleUserInfoUnpassed()
    //     }else if(index === 1){
    //         this.handleUserInfoPassed()
    //     }else if(index === 2){
    //         this.handleUserInfo()
    //     }else if(index === 3){
    //         this.handleUserInfoFail()
    //     }
    // },


    // //获取检查成功患者信息
    // handleUserInfoPassed(){
    //     request({url:'/technician/getScanListOneAndTwo',method:'get'})
    //     .then(
    //         res => {
    //           console.log('检查成功');
    //             console.log(res);
    //             let records = res.data.data.records;
    //             let userInfoPassed = [];
    //             for(let i =0;i<records.length;i++){
    //                 userInfoPassed[i] = records[i]
    //             }
    //             this.setData({ userInfoPassed })

    //         }
    //     )
    // },

    // //获取未检查患者信息
    // handleUserInfoUnpassed(){
    //     request({url:'/technician/getScanListZero',method:'get'})
    //     .then(
    //         res => {
    //           console.log('未检查');
    //             console.log(res)
    //             let records = res.data.data.records;
    //             let userInfoUnpassed = [];
    //             for(let i =0;i<records.length;i++){
    //                 userInfoUnpassed[i] = records[i]
    //             }
    //             this.setData({ userInfoUnpassed })

    //         }
    //     )
    // },

    // //获取取消检查患者
    // handleUserInfoFail(){
    //     request({url:'/technician/getScanListCancel',method:'get'})
    //     .then(
    //         res => {
    //           console.log('取消检查');
    //             console.log(res);
    //             let records = res.data.data.records;
    //             let userInfoFail = [];
    //             for(let i =0;i<records.length;i++){
    //                 userInfoFail[i] = records[i]
    //             }
    //             this.setData({
    //                 userInfoFail
    //             })
    //         }
    //     )
    //     wx.stopPullDownRefresh();
    // },

    onShow(){
        //左上角小房子消失
        wx.hideHomeButton()
        this.setData({showUser: false})
    },

    onLoad(){
        //页面刚加载时获取预约申请用户的数据
        this.handleUserInfo();
        let navHeight = App.globalData.navHeight
        let nav = App.globalData.nav
        this.setData({
            navHeight,nav
        })
    },

    onPullDownRefresh(){
        this.handleUserInfo();
    }
})