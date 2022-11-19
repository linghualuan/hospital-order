import { request } from '../request/request'
Page({
  data: {
    medicalCard:'',
    name:'',
    sex:'',
    tel:'',
    relId:''
  },
  QueryParams:{
    relId:''
  },
  //获取用户的详细信息
  handleUserInfo(){
    let relId = this.QueryParams.relId;
    request({url:'/superRoot/project/getDetailDoctor',data:{relId}})
    .then(
      res => {
        console.log(res);
        let medicalCard = res.data.data.medicalCard;
        let name = res.data.data.name;
        let sex = res.data.data.sex;
        let tel = res.data.data.tel;
        let relId = res.data.data.relId;
        this.setData({ medicalCard, name, sex, tel, relId})
      }
    )
  },
  //获取用户卡号
  handleMedicalCard(e){
    let medicalCard = e.detail.value;
    console.log(medicalCard);
    this.setData({ medicalCard })
  },

  //获取用户姓名
  handleName(e){
    let name = e.detail.value;
    console.log(name);
    this.setData({ name })
  },

  //获取用户性别
  handleSex(e){
    let sex = e.detail.value;
    console.log(sex);
    this.setData({ sex })
  },

  //获取用户手机号
  handleTel(e){
    let tel = e.detail.value;
    console.log(tel);
    this.setData({ tel })
  },

  //提交功能
  handleSubmit(){
    let medicalCard = this.data.medicalCard;
    let name = this.data.name;
    let sex = this.data.sex;
    let tel = this.data.tel;
    let relId = this.data.relId;
    let Name = /^[\u2E80-\u9FFF]+$/;
    let Sex = /^[男|女]{1}$/;
    let Tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    if(!Name.test(name)){
      wx.showToast({
        title: '姓名格式不合法',
        icon:'none'
      })
    }else if(!Sex.test(sex)){
      wx.showToast({
        title: '性别格式不合法',
        icon:'none'
      })
    }else if(!Tel.test(tel)){
      wx.showToast({
        title: '电话格式不合法',
        icon:'none'
      })
    }else{
      request({url:'/superRoot/project/updateMessageByRelId',data:{medicalCard,name,sex,tel,relId}})
      .then(
        res => {
          console.log(res);
          if(res.data.code === 1){
            wx.showToast({
              title: '提交成功',
            })
            setTimeout(() => {
              wx.navigateBack({
                url: '../user_info/user_info',
              })
            },1000)
          }else{
            wx.showToast({
              title:'提交失败'
            })
          }
        }
      )
    }
  },

  //注销功能
  handleDelete(){
    let relId = this.data.relId;
    wx.showModal({
      title:'提示',
      content:'是否确认注销',
      success:res => {
        if(res.confirm){
          request({url:'/superRoot/project/logoutUser',data:{relId}})
          .then(
            res => {
              console.log(res);
              if(res.data.code === 1){
                wx.showToast({
                  title:'注销成功'
                })
                setTimeout(() => {
                  wx.navigateBack({
                    url: '../user_info/user_info',
                  })
                },1000)
              }else{
                wx.showToast({
                  title:'注销失败'
                })
              }
            }
          )
        }
        else if(res.cancel){
          console.log('用户点击取消')
        }
      }
    })
  },

  onLoad(option){
    console.log(option);
    this.QueryParams.relId = option.relId;
  },

  onShow() {
    this.handleUserInfo()
  },
})