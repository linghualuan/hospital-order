import { request } from '../request/request'
Page({
    data: {
        tabs:[
            { id:1, value:"未完成", isActive:true },
            { id:2, value:"已通过", isActive:false },
            { id:2, value:"未通过", isActive:false }
        ],
        userInfo:[],

        userInfoPassed:[],

        userInfoFail:[]
    },

    handleItemTabChange(e){
        let index = e.detail;
        let tabs = this.data.tabs;
        tabs.forEach((v,i)=>{i === index?v.isActive=true:v.isActive=false})
        this.setData({ tabs })
        if(index === 0){
            this.handleOrderMine()
        }else if(index === 1){
            this.handleUserInfoPassed()
        }else if(index === 2){
            this.handleUserInfoFail()
        }
    },

    //获取未完成患者信息
    handleOrderMine(){
        let relId = wx.getStorageSync('relId');
        request({url:'/serve/check/orderList',data:{relId,status:0},header:{'Authorization':'Bearer ' + wx.getStorageSync('token')}})
        .then(
            res => {
                console.log(res);
                let records = res.data.data.records;
                let userInfo = [];
                for(let i =0;i<records.length;i++){
                    userInfo[i] = records[i]
                }
                this.setData({ userInfo })
            }
        )
    },

    //获取已通过患者信息
    handleUserInfoPassed(){
        let relId = wx.getStorageSync('relId');
        request({url:'/serve/check/orderList',data:{relId,status:1},header:{'Authorization':'Bearer ' + wx.getStorageSync('token')}})
        .then(
            res => {
                console.log(res);
                let records = res.data.data.records;
                let userInfoPassed = [];
                for(let i =0;i<records.length;i++){
                    userInfoPassed[i] = records[i]
                }
                this.setData({ userInfoPassed })
            }
        )
    },

    //未通过列表
    handleUserInfoFail(){
        let relId = wx.getStorageSync('relId');
        request({url:'/serve/check/orderList',data:{relId,status:2}})
        .then(
            res => {
                console.log(res);
                let records = res.data.data.records;
                let userInfoFail = [];
                for(let i =0;i<records.length;i++){
                    userInfoFail[i] = records[i]
                }
                this.setData({ userInfoFail })
            }
        )
    },
    
    onShow(){
        this.handleOrderMine();

        this.handleUserInfoPassed();

        this.handleUserInfoFail();
    }
})