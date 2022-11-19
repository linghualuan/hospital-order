import { request } from '../request/request'
Page({

    data: {
        age:'', //年龄
        medicalCard:'', //卡号
        name:'',    //姓名
        orderDate:'',   //预约日期
        orderProject:'',    //预约项目
        orderTime:'',   //预约时间
        relId:'',   //relId
        sex:'', //性别
        tel:'',  //电话
        demo1:false,
        errorMsg: '',
        remark:[],
        info:['未缴费','卡无效','信息有误','其他...'],
        infoContent:['就诊卡未交费','就诊卡无效','就诊卡信息有误'],
        infoIsSelect:[],
        infos:'',
        textareaIsActive:true,  //富文本框的disabled值
        textareaInput:'',    //富文本框输入的值
        isFocus:false,     //是否给富文本框聚焦
        status: 0,
        selectIndex: 0
    },

    QueryParams:{
        medicalCard:'',
        id:''
    },

    //用户点击预约失败按键
    handleClick(){
        let demo1 = true;
        this.setData({ demo1 });
    },

    //点击右上角的×号
    handleError(){
        // let demo1 = false;
        // this.setData({ demo1 });

        let demo1 = false;
        let infoIsSelect = this.data.infoIsSelect;
        this.setData({ demo1 })
        let remark = this.data.remark;
        let textareaInput = ''
        for(let i=0 ; i<remark.length ; i++){
            remark[i] = ''
        }
        for(let i=0 ; i<infoIsSelect.length ; i++){
            infoIsSelect[i] = false
        }
        this.setData({ remark, textareaInput, infoIsSelect })
    },

    //输入富文本框信息
    handleOthers(e){
        let textareaInput = e.detail.value;
        this.setData({textareaInput})
    },

    //用户点击预约失败显示文本框
    handleFail(){
        let demo1 = false;
        let infoIsSelect = this.data.infoIsSelect;
        this.setData({ demo1 })
        let remark = this.data.remark;
        let textareaInput = ''
        for(let i=0 ; i<remark.length ; i++){
            remark[i] = ''
        }
        for(let i=0 ; i<infoIsSelect.length ; i++){
            infoIsSelect[i] = false
        }
        this.setData({ remark, textareaInput, infoIsSelect })
    },

    //点击失败原因时
    handleDemo(e){
        let info = this.data.info;
        let infoContent = this.data.infoContent;
        let remark = this.data.remark;
        let infoIsSelect = this.data.infoIsSelect;
        let textareaInput = this.data.textareaInput;
        for(let i=0 ; i<info.length ; i++){
            if(i !== info.length-1){
                if(e.currentTarget.dataset.index === i){

                    //点击上面三项时把textareaInput的值变为true
                    let textareaIsActive = true;
                    let isFocus = false;
                    textareaInput = ''
                    this.setData({textareaInput ,textareaIsActive, isFocus })

                    //点击选项把布尔值变为相反
                    infoIsSelect[i] = !infoIsSelect[i]
                    this.setData({ infoIsSelect })

                    if(infoIsSelect[i] === true){
                        remark[i] = infoContent[i]
                    }else{
                        remark[i] = ''
                    }
                    this.setData({remark})
                }
            }else if(i === info.length-1){//当点击其他时
                if(e.currentTarget.dataset.index === i){
                    let isFocus = true;
                    let textareaIsActive = this.data.textareaIsActive;
                    textareaIsActive = !textareaIsActive
                    this.setData({textareaIsActive,isFocus})
                    let remark = this.data.remark;
                    for(let i=0 ; i<remark.length ; i++){
                        remark[i] = ''
                    }
                    this.setData({remark})
                }
            }
        }
    },

    handleReadyIsSelect(){
        let info = this.data.info;
        let infoIsSelect = [];
        for(let i = 0 ; i<info.length ; i++){
            infoIsSelect[i] = false
        }
        this.setData({ infoIsSelect })
    },

    //展示用户信息
    handleShowUserInfo(){
        let medicalCard = this.QueryParams.medicalCard;
        let id = this.QueryParams.id;
        request({
            url:'/infoCommit/orderDetail',
            data:{medicalCard,id},
            header:{'Authorization':'Bearer ' + wx.getStorageSync('token')}
        })
        .then(
            res => {
                console.log(res);
                let a = res.data.data;
                let medicalCard = a.medicalCard;
                let name = a.name;
                let orderDate = a.orderDate;
                let orderProject = a.orderProject;
                let orderTime = a.orderTime;
                let relId = a.relId;
                let sex = a.sex;
                let tel = a.tel;
                let errorMsg = a.remark
                this.setData({ 
                    medicalCard, 
                    name, 
                    orderDate, 
                    orderProject, 
                    orderTime, 
                    relId, 
                    sex, 
                    tel,
                    errorMsg
                })
            }
        )
    },

    //预约成功
    handleSubmitSuccess(){
        let relId = wx.getStorageSync('relId');
        let id = this.QueryParams.id;
        wx.showModal({
            title: '提示',
            content: '是否通过预约',
            success (res) {
              if (res.confirm) {
                request({url:'/infoCommit/change',data:{relId,id,status:1},header:{'Authorization':'Bearer ' + wx.getStorageSync('token')}})
                .then(
                    res => {
                        wx.showToast({
                            title: '操作成功'
                        })
                        setTimeout(()=>{
                            wx.reLaunch({
                                url: '../nurse_order/nurse_order',
                            })
                        },1000)
                    }
                )
              }
            }
        })
    },

    //拉黑用户
    handleSubmit(){
        let id = this.QueryParams.id;
        let relId = wx.getStorageSync('relId');
        wx.showModal({
            title:'提示',
            content:'是否将用户拉黑',
            success: res => {
                if(res.confirm){
                    request({url:'/infoCommit/change',data:{id,relId,status:-1},header:{'Authorization':'Bearer ' + wx.getStorageSync('token')}})
                    .then(
                        res => {
                            wx.showToast({
                                title: '操作成功'
                            })
                            setTimeout(()=>{
                                wx.reLaunch({
                                    url: '../nurse_order/nurse_order',
                                })
                            },1000)
                        }
                    )
                }else if(res.cancel){
                    console.log('用户点击取消');
                }
            }
        })
    },

    //用户点击确认预约失败
    handleSuccess(){
        let relId = wx.getStorageSync('relId');
        let textareaInput = this.data.textareaInput;
        let id = this.QueryParams.id;
        let a = this.data.remark;
        let remarkDemo = ''
        for(let i=0 ; i<a.length ; i++){
            if(a[i]){
                if( i !==a.length - 1 ){
                    remarkDemo += a[i] + ','
                }else{
                    remarkDemo += a[i]
                }
            }
        }
        let remark = textareaInput || remarkDemo;
        if(remark){
            let that = this;
            wx.showModal({
                title: '提示',
                content: '是否未通过预约',
                success (res) {
                  if (res.confirm) {
                    request({
                        url:'/infoCommit/change',
                        data:{id,relId,remark,status:2},
                        header:{'Authorization':'Bearer ' + wx.getStorageSync('token')}
                    })
                    .then(
                        res => {
                            wx.showToast({
                                title: '操作成功'
                            })
                            let demo1 = false;
                            that.setData({ demo1 });
                            setTimeout(()=>{
                                wx.reLaunch({
                                url: '../nurse_order/nurse_order',
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
                title:'请输入失败原因',
                icon:'none'
            })
        }
    },


    onLoad(option){
        this.QueryParams.medicalCard = option.medicalCard;
        this.QueryParams.id = option.id;
        this.setData({
            status: option.status,
        })
        console.log('status',this.data.status);
        //执行展示用户信息函数
        this.handleShowUserInfo();
        this.handleReadyIsSelect();
    }
})