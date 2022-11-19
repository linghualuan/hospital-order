import { request } from '../request/request'
let util = require('../../utils/util');
Page({

    data: {
        date:'', //日期
        turnTime:'',    //检查时间
        rank:'',    //需等待人数
        scanNumber:'',  //排队序号
        differ:'',   //等待时间
        project:'',  //检查项目
        time:'', //当前时间
        injectState:0,   //注射状态
        dose:'', //注射计量
        nowTime:'',
        time:'',
        position:'',
        demo:''
    },

    QueryParams:{
        id:'',
        demo:''
    },

    handleQueueDetail(){
        let demo = this.QueryParams.demo;
        this.setData({demo})
        let id = this.QueryParams.id;
        request({url:'/serve/check/scanDetail',data:{id},header:{'Authorization':'Bearer ' + wx.getStorageSync('token')}})
        .then(
            res => {
                console.log(res)
                let date = res.data.data.date.split(' ')[0];
                let time = res.data.data.date.split(' ')[1];
                let turnTime = res.data.data.turnTime;
                let rank = res.data.data.rank;
                let injectNumber = res.data.data.injectNumber;
                let cutDownTime = res.data.data.cutDownTime;
                let project = res.data.data.project;
                let injectState = res.data.data.injectState;
                let dose = res.data.data.dose;
                let position = res.data.data.position;
                let scanNumber = res.data.data.scanNumber;
                this.setData({scanNumber, date, turnTime, rank, injectNumber, cutDownTime, project,injectState,time,dose,position})
            }
        )
        wx.stopPullDownRefresh();
    },

    handleTime(){
        var time = util.formatTime(new Date());
        let a = time.split(' ');
        let nowTime = a[1];
        this.setData({nowTime})
    },

    //取消检查
    handleUnorder(){
        let id = this.QueryParams.id;
        wx.showModal({
            title:'提示',
            content:'是否取消检查',
            success: res => {
                if(res.confirm){
                    request({url:'/serve/check/cancelScan',data:{id}})
                    .then(
                        res => {
                            let msg = res.data.msg;
                            wx.showToast({
                            title: msg,
                            icon:'none'
                            })
                            setTimeout(() => {
                                wx.navigateBack({
                                url: '../number_mine/number_mine',
                                })
                            },2000)
                        }
                    )
                }else{
                    console.log('用户点击取消');
                }
            }
        })
    },

    onLoad(option){

        this.QueryParams.id = option.id;

        this.QueryParams.demo = option.demo;

        this.handleTime();

        this.handleQueueDetail();
    },

    onPullDownRefresh(){
        this.handleQueueDetail();
        this.handleTime();
    }
})