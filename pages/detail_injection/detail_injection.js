let util = require('../../utils/util');
import { request } from '../request/request'
Page({

    data: {
        medicalCard:'',
        name:'',
        sex:'',
        age:'',
        tel:'',
        project:'',
        relId:'',
        date:'',    //注射日期
        dose:'',    //注射计量
        position:'', //注射部位
        positions:'',
        item:[
            {value:'左手',name:'左手',checked:false,disabled:false},
            {value:'右手',name:'右手',checked:false,disabled:false},
            {value:'左肘',name:'左肘',checked:false,disabled:false},
            {value:'右肘',name:'右肘',checked:false,disabled:false}
        ],
        radioIsSelect:false,       //单选框是否可以选择
        isActive:false,   //当为false时不显示弹框
        textareaInput:'',  //失败原因
        status: 0
    },

    QueryParams:{
        medicalCard:'',
        project:'',
        id:''
    },

    //用户点击注射失败按键
    handleFail(){
      let isActive = true;
      this.setData({ isActive });
    },

    //用户点击×号
    handleError(){
      let isActive = false;
      let textareaInput = '';
      this.setData({ isActive, textareaInput })
    },

    //用户点击取消按钮
    handleFailText(){
      let isActive = false;
      let textareaInput = '';
      this.setData({ isActive, textareaInput })
    },

    //用户点击单选按钮
    checkedTap(e){
      let item = this.data.item;
      for(let i = 0 ; i<item.length ; i++){
        if(e.currentTarget.dataset.index === i){
          item[i].checked = !item[i].checked
          var index = i
        }
      }
      for(let i = 0 ; i<item.length ; i++){
        if(index !== i){
          item[i].checked = false
        }
      }
      this.setData({item})

      for(let i=0 ; i<item.length ; i++){
        if(item[i].checked === true){
          let position = '';
          this.setData({position})
        }
      }
    },

    handlePosition(e){
        let item = this.data.item
        for(let i=0 ; i<item.length ; i++){
          item[i].checked = false;
        }
        this.setData({ item })
    },

    //获取注射部位
    handleInput(e){
      let position = e.detail.value
      this.setData({position})
    },

    //获取注射剂量
    handleDose(e){
        let dose = e.detail.value + 'mCi';
        this.setData({ dose })
    },

    //获取注射时间
    handleTime(){
        let that = this;
        wx.showModal({
            title: '提示',
            content: '是否选择当前时间',
            success (res) {
              if (res.confirm) {
                var time = util.formatTime(new Date());
                that.setData({ date:time })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
    },

    //输入失败原因
    handleInputFail(e){
      let textareaInput = e.detail.value;
      this.setData({textareaInput})
    },

    //获得用户信息
    handleUserInfo(){
        let medicalCard = this.QueryParams.medicalCard;
        let project = this.QueryParams.project;
        let id = this.QueryParams.id;
        request({url:'/nurseInjection/injectionDetail',data:{medicalCard,project,id},method:'get'})
        .then(
            res => {
                let Info = res.data.data;
                let medicalCard = Info.medicalCard;
                let name = Info.name;
                let sex = Info.sex;
                let age = Info.age;
                let tel = Info.tel;
                let project = Info.project;
                let relId = Info.relId;
                let errorMsg = Info.remark;
                this.setData({ medicalCard, name, sex, age, tel, project,relId, errorMsg })
            }
        )
    },

    //点击确认注射失败按钮
    handleSuccessCancel(){
      let date = this.data.date;
      let dose = this.data.dose;
      let errorMsg = this.data.textareaInput;
      let id = this.QueryParams.id;
      let item = this.data.item;
      let medicalCard = this.data.medicalCard;
      let positionDemo = this.data.position;
      let project = this.data.project;
      let relId = this.data.relId;
      for(let i=0 ; i<item.length ; i++){
        if(item[i].checked === true){
          var itemPosition = item[i].value
        }
      }
      let position = positionDemo?positionDemo:itemPosition;
      request({url:'/nurseInjection/injection',data:{date,dose,errorMsg,id,medicalCard,position,project,relId,injectState:2}})
      .then(
        res => {
          let msg = res.data.msg;
          wx.showToast({
            title: msg,
            icon:'none'
          })
          let isActive = false
          this.setData({isActive})
          setTimeout(() => {
            wx.reLaunch({
              url: '../nurse_injection/nurse_injection',
            })
          },1000)
        }
      )
    },

    //注射成功
    handleSuccess(){
      let relId = this.data.relId;
      let dose = this.data.dose;
      let date = this.data.date;
      let id = this.QueryParams.id;
      let positionDemo = this.data.position;
      let project = this.data.project;
      let medicalCard = this.data.medicalCard;
      let item = this.data.item;
      let errorMsg = '成功'
      for(let i=0 ; i<item.length ; i++){
        if(item[i].checked === true){
          var itemPosition = item[i].value
        }
      }
      let position = positionDemo?positionDemo:itemPosition;
      console.log(position);
      if(date && position && dose){
        wx.showModal({
          title: '提示',
          content: '是否注射成功',
          success (res) {
            if (res.confirm) {
              request({url:'/nurseInjection/injection',data:{id,medicalCard,project,relId,dose,date,position,errorMsg,injectState:1},method:'get'})
              .then(
                  res => {
                      wx.showToast({
                        title:'成功'
                      })
                      setTimeout(()=>{
                          wx.reLaunch({
                            url: '../nurse_injection/nurse_injection',
                          })
                      },1000)
                  }
              )
            } else if(res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else{
        wx.showToast({
          title: '请输入完整信息',
          icon:'none'
        })
      }
    },

    onLoad(option) {
      this.QueryParams.medicalCard = option.medicalCard;
      this.QueryParams.project = option.project;
      this.QueryParams.id = option.id;
      console.log('option',option);
      this.setData({
        status: option.status
      })
      this.handleUserInfo();
    },
})