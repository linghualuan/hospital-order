import { request } from '../request/request'
let util = require('../../utils/util');
Page({

    data: {
        date:'', //日期
        turnTime:'',    //检查时间
        rank:'',    //需等待人数
        project:'',  //检查项目
        time:'', //当前时间
        injectState:0,   //注射状态
        dose:'', //注射计量
        nowTime:'',
        position:'',
        demo:'',
        errorMsg:''
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
                let turnTime = res.data.data.turnTime;
                let rank = res.data.data.rank;
                let injectNumber = res.data.data.injectNumber;
                let cutDownTime = res.data.data.cutDownTime;
                let project = res.data.data.project;
                let injectState = res.data.data.injectState;
                let dose = res.data.data.dose;
                let position = res.data.data.position;
                let scanNumber = res.data.data.scanNumber;
                let errorMsg = res.data.data.errorMsg;
                let finishTime = res.data.data.finishTime;
                this.setData({
                    scanNumber, 
                    date, 
                    turnTime, 
                    rank, 
                    injectNumber, 
                    cutDownTime, 
                    project,
                    injectState,
                    dose,
                    position,
                    errorMsg,
                    finishTime
                })
            }
        )
    },

    handleTime(){
        var time = util.formatTime(new Date());
        let a = time.split(' ');
        let nowTime = a[1];
        this.setData({nowTime})
    },

    handleUnorder(){
        let id = this.QueryParams.id;
        request({url:'/serve/check/cancelScan',data:{id}})
        .then(
            res => {
                let msg = res.data.msg;
                wx.showToast({
                  title: msg,
                  icon:'none'
                })
                setTimeout(() => {
                    wx.reLaunch({
                      url: '../number_mine/number_mine',
                    })
                },2000)
            }
        )
    },

    onLoad(option){

        this.QueryParams.id = option.id;

        this.QueryParams.demo = option.demo;

        this.handleTime();

        this.handleQueueDetail();
    },
})