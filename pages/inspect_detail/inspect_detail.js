import { request } from '../request/request'
let util = require('../../utils/util');
Page({

    data: {
        date:'', //日期
        turnTime:'',    //检查时间
        rank:'',    //需等待人数
        injectNumber:'',  //排队序号
        differ:'',   //等待时间
        project:'',  //检查项目
        time:'', //当前时间
        injectState:0,   //注射状态
        dose:'', //注射计量
        nowTime:'',
        time:'',
        demo:0,
        position:''
    },

    QueryParams:{
        id:''
    },

    handleQueueDetail(){
        let id = this.QueryParams.id;
        request({url:'/serve/check/scanDetail',data:{id},header:{'Authorization':'Bearer ' + wx.getStorageSync('token')}})
        .then(
            res => {
                console.log(res)
                // let date = res.data.data.date.split(' ')[0];
                // let time = res.data.data.date.split(' ')[1];
                // let turnTime = res.data.data.turnTime;
                // let rank = res.data.data.rank;
                // let injectNumber = res.data.data.injectNumber;
                // let cutDownTime = res.data.data.cutDownTime;
                // let project = res.data.data.project;
                // let injectState = res.data.data.injectState;
                // let dose = res.data.data.dose;
                // let position = res.data.data.position;
                // this.setData({ date, turnTime, rank, injectNumber, cutDownTime, project,injectState,time,dose,position})
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
        request({url:'/serve/order/cancelOrder',data:{id}})
        .then(
            res => {
                console.log(res);
            }
        )
    },

    handleDemo(){
        let demo = this.QueryParams.demo;
        this.setData({demo})
        console.log(demo);
    },

    onLoad(option){

        console.log(option);

        this.QueryParams.id = option.id;

        this.handleQueueDetail();
    },
})