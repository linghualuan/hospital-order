import { request } from '../request/request'
Page({

    data: {
        userInfo:[]
    },

    handleUserList(){
        let relId = wx.getStorageSync('relId');
        request({url:'/serve/check/failOrFine',data:{relId}})
        .then(
            res => {
                console.log(res);
                let userInfo = [];
                let a = res.data.data.records;
                for(let i=0 ; i<a.length ; i++){
                    userInfo[i] = a[i]
                }
                this.setData({userInfo})
            }
        )
    },

    onLoad(){
        this.handleUserList()
    }

})