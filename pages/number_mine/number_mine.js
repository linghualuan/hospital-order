import { request } from '../request/request'
Page({
    data: {
        tabs:[
            { id:1, value:"注射叫号", isActive:true },
            { id:2, value:"检查叫号", isActive:false}
        ],
        userInfoInjection:[],   //注射叫号列表

        userInfoInspect:[],      //检查叫号列表

        userInfoFail:[]
    },

    handleItemTabChange(e){
        let index = e.detail;
        let tabs = this.data.tabs;
        tabs.forEach((v,i)=>{ i === index?v.isActive=true:v.isActive=false })
        this.setData({ tabs })

        if(index === 0){
            this.handleInjectionList()
        }else if(index === 1){
            this.handleReadyQueue()
        }else{
            this.handleUserInfoFail()
        }
    },

    //注射叫号
    handleInjectionList(){
        let relId = wx.getStorageSync('relId');
        request({url:'/serve/check/injectionList',data:{relId},header:{'Authorization':'Bearer ' + wx.getStorageSync('token')}})
        .then(
            res => {
                console.log(res);
                let records = res.data.data.records;
                let userInfoInjection = [];
                for(let i =0;i<records.length;i++){
                    userInfoInjection[i] = records[i]
                }
                this.setData({ userInfoInjection })
            }
        )
    },


    //检查叫号
    handleReadyQueue(){
        let relId = wx.getStorageSync('relId');
        request({url:'/serve/check/scanList',data:{relId},header:{'Authorization':'Bearer ' + wx.getStorageSync('token')}})
        .then(
            res => {
                console.log(res);
                let records = res.data.data.records;
                let userInfoInspect = [];
                for(let i =0;i<records.length;i++){
                    userInfoInspect[i] = records[i]
                }
                this.setData({ userInfoInspect })
            }
        )
        wx.stopPullDownRefresh();
    },

    onReady(){
        this.handleInjectionList();
    },

    onPullDownRefresh(){
        this.handleReadyQueue();
    }
})