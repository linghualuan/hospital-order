import { request } from '../request/request'
Page({

    data: {
        name:'',
        sex:'',
        tel:'',
        password:'',
        jobNum:'',
        medicalCard:'',
        relId:''
    },

    QueryParams:{
        relId:''
    },

    handleName(e){
        this.setData({name:e.detail.value})
        console.log(this.data.name);
    },

    handleSex(e){
        this.setData({sex:e.detail.value})
    },

    handleTel(e){
        this.setData({tel:e.detail.value})
    },

    handlePassword(e){
        this.setData({password:e.detail.value})
    },

    handleJobNum(e){
        this.setData({jobNum:e.detail.value})
    },

    handleInfo(){
        let relId = this.QueryParams.relId;
        console.log(relId);
        request({url:'/superRoot/project/getDetailDoctor',data:{relId}})
        .then(
            res => {
                console.log(res);
                let name = res.data.data.name;
                let sex = res.data.data.sex;
                let tel = res.data.data.tel;
                let password = res.data.data.password;
                let jobNum = res.data.data.jobNum;
                let medicalCard = res.data.data.medicalCard;
                let relId = res.data.data.relId;
                this.setData({name,sex,tel,password,jobNum,medicalCard,relId})
            }
        )
    },

    //提交修改后的信息
    handleSubmit(){
        let name = this.data.name;
        let sex = this.data.sex;
        let tel = this.data.tel;
        let jobNum = this.data.jobNum;
        let password = this.data.password;
        let relId = this.data.relId;
        let medicalCard = this.data.medicalCard;
        let Name = /^[\u2E80-\u9FFF]+$/;
        let Sex = /^[男|女]{1}$/;
        let Tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        if(name.trim().length>0 && sex.trim().length>0 && tel.trim().length>0 && jobNum.trim().length>0 &&  password.trim().length>0){
          if(!Name.test(name)){
            wx.showToast({
              title:'名字不合法',
              icon:'none'
            })
          }else if(!Sex.test(sex)){
            wx.showToast({
              title:'性别不合法',
              icon:'none'
            })
          }else if(!Tel.test(tel)){
            wx.showToast({
              title:'电话格式不合法',
              icon:'none'
            })
          }else{
            request({url:'/superRoot/project/updateMessageByRelId',data:{jobNum,name,sex,tel,password,relId,medicalCard}})
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
        }else{
          wx.showToast({
            title:'必填项不能为空',
            icon:'none'
          })
        }
    },

    handleDelete(){
        let relId = this.data.relId;
        wx.showModal({
          title: '提示',
          content: '是否注销用户',
          success: res => {
            if(res.confirm){
              request({url:'/superRoot/project/logoutUser',data:{relId}})
              .then(
                  res => {
                      console.log(res);
                      if(res.data.code === 1){
                          wx.showToast({
                            title: '注销成功',
                          })
                          setTimeout(() => {
                              wx.navigateBack({
                                  url: '../user_info/user_info',
                              })
                          },1000)
                      }
                  }
              )
            }else if(res.cancel){
              console.log('用户点击取消');
            }
          }
        });
    },

    onLoad(option){
        console.log(option);
        this.QueryParams.relId = option.relId;
        this.handleInfo()
    }
})