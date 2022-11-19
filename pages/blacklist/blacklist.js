import { request } from '../request/request'
Page({
    data: {

        tabs:[
            { id:1, value:"未解除", isActive:true },
            { id:2, value:"已解除", isActive:false }
        ],

        userInfo:[],

        userInfoUnpassed:[]
    },

    //组件定义事件
    handleItemTabChange(e){
        let index = e.detail;
        let tabs = this.data.tabs;
        tabs.forEach((v,i)=>{ i === index?v.isActive=true:v.isActive=false })
        this.setData({ tabs })
        if(index === 0){
            this.handleUserInfoUnpassed()
        }else{
            this.handleUserInfo()
        }
    },

    //获取已解除用户信息
    handleUserInfo(){
        request({url:'/superRoot/project/getBlackOrWhiteList',data:{black:1}})
        .then(
            res => {
                let records = res.data.data;
                let userInfo = [];
                for(let i =0;i<records.length;i++){
                    userInfo[i] = records[i]
                }
                this.setData({ userInfo })
            }
        )
    },

    //获取未解除用户信息
    handleUserInfoUnpassed(){
        request({url:'/superRoot/project/getBlackOrWhiteList',data:{black:0}})
        .then(
            res => {
                let records = res.data.data;
                let userInfoUnpassed = [];
                for(let i =0;i<records.length;i++){
                    userInfoUnpassed[i] = records[i]
                }
                this.setData({ userInfoUnpassed })
            }
        )
    },

    //解除黑名单
    handleRelieve(e){
        let index = e.currentTarget.dataset.index;
        let medicalCard = this.data.userInfoUnpassed[index].medicalCard;
        wx.showModal({
            title:'提示',
            content:'是否解除',
            success:res => {
                if(res.confirm){
                    request({url:'/superRoot/project/updateRelationshipBlack',data:{black:1,medicalCard},method:'get'})
                    .then(
                        res => {
                            if(res.data.code === 1){
                                let msg = res.data.msg;
                                //过滤数组
                                let userInfoUnpassed = this.data.userInfoUnpassed.filter((v,i) => {
                                    return index !== i;
                                })
                                this.setData({userInfoUnpassed})
                                wx.showToast({
                                    title: msg,
                                    icon:'none'
                                })
                            }else{
                                wx.showToast({
                                    title: '解除失败'
                                })
                            }
                        }
                    )
                }else if(res.cancel){
                    console.log('用户点击取消');
                }
            }
        })
    },

    onLoad(){
        this.handleUserInfoUnpassed()
    }
})