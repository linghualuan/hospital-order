let util = require('../../utils/util');
import { request } from '../request/request'
Page({
    // 案例：
    // 日期：2022-03-15
    // 时间段：06:00-08:00
    data: {
        note: '',   //注意事项
        month:'',   //获取年份
        year:'',    //获取月份
        day:[], //每个月的天数
        weekday:0, //今天是周几
        n:[],   //每月1号前面的空格数
        number:0,    //今天是多少号
        types:[],    //从后端获取到每天可选择就医的时间段
        selectType:'',   //用户选择的时间段
        orderId:[],  //可预约日期的Id
        date:{},
        dayTF:[],  //背景为绿色的可预约天数可预约的时间段
        selectDate:[],
        orderDate:'',    //预约的日期
        select:false,   //是否已经预约
        backgroundColor:[],     //点击可预约日期变色
        allNumber:[],    //绿色背景下的可预约人数
        notSelect:[],
        orderProject:'',
    },

    QueryParams:{
        orderProject:''
    },

    //用户选择的时间段
    handleSelectChange(e){
        let types = this.data.types;
        let index = e.detail;
        let selectType = this.data.selectType;
        selectType = types[index].slice(0,11);
        this.setData({ selectType })
    },
    //月份增加
    handleMouthSum(){
        let month = parseInt(this.data.month);
        let year = parseInt(this.data.year);
        if(month>0&&month<12){
            if(month>0&&month<9){
                let a = month; a++;
                month = '0' + a;
            }else{
                month++;
            }
        }else{
            month ='0' + 1;
            year++
        }
        this.setData({
            month:String(month),
            year:String(year),
            backgroundColor:[]  //当点击月份减小时把黄色的背景去掉
        })
        this.handleDate();
        this.handleDateId();
        this.judgeWeek();
    },

    //月份减少
    handleMouthSub(){
        let month = parseInt(this.data.month);
        let year = parseInt(this.data.year);
        if(month>1&&month<=12){
            if(month>1&&month<11){ let a = month; a--; month = '0' + a; }
            else{ month--; }
        }else{
            month = 12;
            year--;
        }
        this.setData({
            month:String(month),
            year:String(year),
            backgroundColor:[]  //当点击月份增加时把黄色的背景去掉
        })
        this.handleDate();
        this.handleDateId();
        this.judgeWeek();
    },

    //获取当前年月份并给data中的数据赋值
    handleTime(){
        //给orderProject赋值
        this.setData({orderProject:this.QueryParams.orderProject})
        //获取当前时间
        var time = util.formatTime(new Date());

        //获取当前的年份
        let year = time.slice(0,4)

        //获取当前月份
        let month = time.slice(5,7);

        //获取当前多少号
        let number = parseInt(time.slice(8,10))

        //获取当前星期几
        let weekday = parseInt(util.getWeekByDate(new Date()));

        //把年份，月份，多少号赋值给data
        this.setData({
            year,month,number,weekday
        })
    },

    //根据不同年份和月份获取每月不同的天数
    handleDate(){
        let year = this.data.year;
        let month = String(this.data.month);
        // let day = this.data.day;
        let day = [];

        //判断闰年
        if((year%4 == 0 && year%100 != 0) || year%400 == 0){
            if(month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12){
                day = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
            }else if(month == 2){
                day = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29']
            }else{
                day = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30']
            }
        }else{
            if(month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12){
                day = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
            }else if(month == 2){
                day = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28']
            }else{
                day = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30']
            }
        }
        this.setData({ day })
    },

    //根据年份和月份获取每月1号是星期几
    judgeWeek () {
        let year = this.data.year;
        let month = this.data.month;
        let dt = new Date();
        dt.setFullYear(year);
        dt.setMonth(month - 1);
        dt.setDate(1);
        let a = dt.getDay() ? dt.getDay() : 7;
        let n = new Array(a - 1);
        for(let i = 0;i<n.length;i++){n[i] = ''}
        this.setData({ n })
        // console.log(year+'年的'+month+'月的一号是'+a);
    },

    //获取可预约日期和id集合
    handleDateId(e){
        let day = this.data.day;
        let month = String(this.data.month);
        let year = String(this.data.year);
        //把可选择的日期对应的下标定为true。例如：本月12号可以预 约，则把下标为11的项赋值为true
        let dayTF = new Array(day.length);
        //如果可预约日期为true,则把可预约日期的可预约人数赋值给allNumber对应的下标
        let allNumber = new Array(day.length);
        let orderProject = this.QueryParams.orderProject;

        //此数组里面的内容为布尔值，当日期已经过去或者可预约人数为0时，把值定为true，此时日期的背景为灰色
        let notSelect = [];
        request({
            url:'/serve/order/getOrderDate',
            data:{orderProject},
            header:{'Authorization':'Bearer ' + wx.getStorageSync('token')}
        })
        .then(
            res => {
                let a = res.data.data;
                let selectDate = new Array(dayTF.length);
                a.forEach( v =>{
                    let orderYear = v.orderDate.slice(0,4);
                    let orderMonth = v.orderDate.slice(5,7);
                    let orderDay = v.orderDate.slice(8,10);
                    for(let i=0 ; i<=dayTF.length; i++){
                        if(month===orderMonth && year===orderYear){
                            if(parseInt(orderDay)===i){
                                dayTF[i-1] = true;
                                allNumber[i-1] = v.numbers;
                                selectDate[i-1] = v;
                            }
                        }
                    }
                })
                this.setData({ dayTF, selectDate, allNumber })

                //当dayTF的值为true，即为可预约的日期，再判断点击的日期是否小于今天的日期以及可预约的人数是否为0，
                //若满足此条件，则让notSelect对应的下标为true
                let nowDay = (new Date()).getDate();
                let nowYear = (new Date()).getFullYear();
                let nowMonth = (new Date()).getMonth() + 1;
                this.data.selectDate.forEach((v,i) => {
                    if(this.data.dayTF[i]){
                        if(nowMonth>=month && nowYear>=year){
                            if(i<nowDay){
                                notSelect[i] = true
                            }
                        }
                        if(v.numbers == 0){
                            notSelect[i] = true
                        }
                    }
                })
                this.setData({notSelect})
            }
        )
    },

    //点击可选择的日期获取时间段
    handleSelectDate(e){
        let day = this.data.day;    //每月的天数
        let dayTF = this.data.dayTF;        //背景为绿色的可预约日期
        let month = String(this.data.month);    //获取当前月份
        let year = String(this.data.year);  //获取当前年份
        //----------------
        //获取当前年份，月份，日
        let nowDay = (new Date()).getDate();
        let nowYear = (new Date()).getFullYear();
        let nowMonth = (new Date()).getMonth() + 1;
        //----------------
        let selectDate = this.data.selectDate;
        const index = e.currentTarget.dataset.index;
        let backgroundColor = [];
        day.forEach((v,i)=>{
            if(i === index){
                if(dayTF[i]===true && this.data.notSelect[i] !== true){  //i>=nowDate.getDate()的作用是:当点击的日期如果大于或等于今天的日期再执行
                    if(year>=nowYear && month>nowMonth && parseInt(this.data.allNumber[i]) !== 0){
                        backgroundColor[i] = true
                        let orderDate = selectDate[i].orderDate;
                        this.setData({ orderDate });
                        wx.request({
                            url: 'https://xyeyyhyxk.top:8881/serve/order/getOrderTime',
                            data:{
                                    date:this.data.orderDate,
                                    orderId:selectDate[i].orderId
                                },
                            success:res => {
                                console.log(res);
                                let a = res.data.data;
                                let types = a.map(v => v.orderTime + '(' + v.allowNumber + ')')
                                this.setData({ types })
                            }
                        })
                    }else if(year == nowYear && month == nowMonth && i + 1>=nowDay && parseInt(this.data.allNumber[i]) !== 0){
                        backgroundColor[i] = true
                        let orderDate = selectDate[i].orderDate;
                        this.setData({ orderDate });
                        wx.request({
                            url: 'https://xyeyyhyxk.top:8881/serve/order/getOrderTime',
                            data:{
                                    date:this.data.orderDate,
                                    orderId:selectDate[i].orderId
                                },
                            success:res => {
                                let a = res.data.data;
                                let types = a.map(v => v.orderTime + '(' + v.allowNumber + ')')
                                this.setData({ types })
                            }
                        })
                    }
                }else{
                    backgroundColor[i] = false
                    this.setData({selectType:'',types:[]})      //当点击非预约日期或背景为灰色的  日期，下拉框中的日期赋值为空，
                                                                //否则点击一个可预约并且有课预约人数不为0的日期后再点击空白日期或
                                                                //灰色日期后下拉框中还会有残留的时间段
                }
                this.setData({backgroundColor})
            }
        })
    },

    //提交预约
    handleSubmit(){
        let orderDate = this.data.orderDate;    //获取预约的日期
        let orderTime = this.data.selectType;   //获取预约的时间段
        if(!wx.getStorageSync('medicalCard')) { //判断本地是否有用户信息
            console.log('285',this.data.isAlreadyLogin);
            if(this.data.isAlreadyLogin) { //判断数据库是否有信息
                if(orderTime&&orderDate){     //如果日期和时间不为空
                    //预约消息判断及信息提交
                    this.judgeOrderMessage();
                    // this.submitConsumer()
                }else{  //如果日期和时间段为空
                    wx.showToast({
                      title: '请选择预约的日期',
                      icon:'none'
                    })
                }
                return;
            }
            wx.navigateTo({
                url: '../userInfo/userInfo',
            })
            
        }else { //如果本地没有信息
            if(orderTime&&orderDate){     //如果日期和时间不为空
                //预约消息判断及信息提交
                this.judgeOrderMessage();
            }else{  //如果日期和时间段为空
                wx.showToast({
                  title: '请选择预约的日期',
                  icon:'none'
                })
            }
        }
    },
    //数据库信息判断
    checkDistance() {
        request({url:'/login/checkConsumer',data:{token:wx.getStorageSync('token')}})
        .then(
            res => {
                console.log(res);
                if(res.data.code === 1) {
                    wx.setStorageSync('medicalCard', res.data.data.medicalCard)
                    wx.setStorageSync('name', res.data.data.name)
                    wx.setStorageSync('relId', res.data.data.relId)
                    wx.setStorageSync('tel', res.data.data.tel)
                    wx.setStorageSync('sex', res.data.data.sex)
                }
            }
        )
    },
    //判断订阅消息及信息提交
    judgeOrderMessage() {
        let that = this
        wx.requestSubscribeMessage({
            tmplIds: [
                'xKyH69hLBBxdywQXPtf-H5bbSHUL3Xjlmmv7Rc_vu08','Gj76q-6KsUhkGPrYfvslO2MbdMr_H-1QmkEiYnBNHnU',
                'bu3pNgiYdt2NnuR476D6Qjpm97VbvatgF-50Yu5ZVMo'
            ],
            success (res) {
                if(res['xKyH69hLBBxdywQXPtf-H5bbSHUL3Xjlmmv7Rc_vu08'] === 'accept' 
                && res['Gj76q-6KsUhkGPrYfvslO2MbdMr_H-1QmkEiYnBNHnU'] === 'accept'
                && res['bu3pNgiYdt2NnuR476D6Qjpm97VbvatgF-50Yu5ZVMo'] === 'accept'){
                   //提交预约信息
                    that.submitConsumer();
                }else{
                    wx.showToast({
                        title: '请确认订阅后继续',
                        icon:'none'
                    })
                }
            },
            fail:err => {
                console.log(err);
            }
        })
    },
    //提交预约信息
    submitConsumer() {
        let orderDate = this.data.orderDate;    //获取预约的日期
        let orderProject = this.QueryParams.orderProject;   //获取预约的项目
        let orderTime = this.data.selectType;   //获取预约的时间段
        let relId = wx.getStorageSync('relId');     //获取用户的relId
        let medicalCard = wx.getStorageSync('medicalCard'); //获取用户的卡号
        request({url:'/serve/order/orderProject',data:{medicalCard,orderDate,orderProject,orderTime,relId}})
        .then(
            res => {
                if(res.data.code === 1){
                    wx.showToast({
                        title:'预约成功',
                        icon:'success'
                    })
                    setTimeout(() => {
                        wx.navigateBack({
                            url: '../index/index',
                        })
                    },1000)
                }else{
                    let msg = res.data.msg;
                    wx.showToast({
                        title:msg,
                        icon:'none'
                    })
                    setTimeout(() => {
                        wx.navigateBack({
                            url: '../order_project/order_project',
                        })
                    },1000)
                }
            }
        )
    },

    onLoad(option){
        this.QueryParams.note = option.note;
        this.setData({note:option.note})

        //option为请求路径传进来的参数
        //把路径的参数赋值给QueryParams对象
        this.QueryParams.orderProject = option.orderProject;

        //执行获取日期函数
        this.handleTime();

        //根据不同年份和月份获取每月不同的天数
        this.handleDate();

        //日历表中开头的空格数
        this.judgeWeek();

        this.checkDistance();
    },

    onShow(){
        this.handleDateId();
    }
})