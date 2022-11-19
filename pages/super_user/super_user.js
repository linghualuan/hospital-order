import { request } from '../request/request'
Page({
    data: {
        jobNum:'',     //账号
        password:'',     //密码
        number:''
    },

    //获取账号
    handleAccount(e){
        let jobNum = e.detail.value;
        this.setData({jobNum})
    },

    //获取密码
    handlePwd(e){
        let password = e.detail.value;
        this.setData({password})
    },

    //登录
    handleSubmit(){
        let jobNum = this.data.jobNum;
        let password = this.data.password;
        let token = wx.getStorageSync('token')
        if(!jobNum || !password){
            wx.showToast({
              title: '账号或密码不能为空',
              icon:'none'
            })
        }else{
            request({
                url:'/login/super/up',
                data:{jobNum:jobNum,password:password,token},method:'post',header: {"Content-Type":"application/x-www-form-urlencoded"}
            })
            .then(
                res => {
                    console.log(res);
                    let msg = res.data.msg;
                    if(res.data.code === 1){
                        let number = res.data.data.medicalCard;
                        let relId = res.data.data.relId;
                        let medicalCard = res.data.data.medicalCard;
                        wx.setStorageSync('relId',relId);
                        wx.setStorageSync('medicalCard',medicalCard);
                        wx.getUserProfile({
                            desc:"用于绑定用户的卡号",
                            success:(res) => {
                                //-------------------------------------------
                                console.log(res);
                                const userInfo = res.userInfo;
                                this.setData({ userInfo})
                                //把微信信息保存到本地
                                wx.setStorageSync("userInfo", userInfo);
                                //------------------------------------------
                                if(number === 's10001'){
                                    setTimeout(() => {
                                        wx.reLaunch({
                                            url:'../super_index/super_index'
                                        })
                                    },1000)
                                }else if(number === 'n10002'){
                                    setTimeout(() => {
                                        wx.reLaunch({
                                            url: '../nurse_order/nurse_order',
                                        })
                                    },1000)
                                }else if(number === 'n10003'){
                                    setTimeout(() => {
                                        wx.reLaunch({
                                            url: '../nurse_injection/nurse_injection',
                                        })
                                    },1000)
                                }else if(number === 't10004'){
                                    setTimeout(() => {
                                        wx.reLaunch({
                                            url: '../technician/technician',
                                        })
                                    },1000)
                                }
                                    },
                                    fail:(res) => {
                                        console.log("用户拒绝授权");
                                    }
                                })
                        
                    }else{
                        wx.showToast({
                            title: msg,
                            icon:'none'
                        })
                    }
                }
            )
        }
    },

    //判断是否存在用户信息
    /*handleSuper() {
        if(wx.getStorageSync('token')) {
            request({url:'/login/checkAdmin',data:{token:wx.getStorageSync('token')}})
            .then(
                res => {
                    console.log(res)
                    if(res.data.data){
                        wx.setStorageSync('medicalCard',res.data.data.medicalCard);
                        wx.setStorageSync('name',res.data.data.name);
                        wx.setStorageSync('sex',res.data.data.sex);
                        wx.setStorageSync('tel',res.data.data.tel);
                        wx.setStorageSync('relId',res.data.data.relId);
                        let medicalCard = res.data.data.medicalCard;
                        this.localCheck(medicalCard);
                    }
                }
        )}
    },*/

      //本地身份检查方法
    //   localCheck(number) {
    //     if(number === 's10001'){ //如果本地信息为超级管理员则跳转到超级管理员
    //     setTimeout(() => {
    //         wx.reLaunch({
    //             url:'/pages/super_index/super_index'
    //         })
    //     },0)
    //     }else if(number === 'n10002'){ //如果本地信息为预约护士则跳转到预约护士
    //         setTimeout(() => {
    //             wx.reLaunch({
    //                 url: '/pages/nurse_order/nurse_order',
    //             })
    //         },0)
    //     }else if(number === 'n10003'){ //如果本地信息为注射护士则跳转到注射护士
    //         setTimeout(() => {
    //             wx.reLaunch({
    //                 url: '/pages/nurse_injection/nurse_injection',
    //             })
    //         },0)
    //     }else if(number === 't10004'){ //如果本地信息为采集技师则跳转到采集技师
    //         setTimeout(() => {
    //             wx.reLaunch({
    //                 url: '/pages/technician/technician',
    //             })
    //         },0)
    //     }
    // },


    onShow() {
        //页面左上角小房子消失
        wx.hideHomeButton()
    },

    
    onLoad() {
       if(!wx.getStorageSync('token')) {
        wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              console.log("code:"+res.code);
              wx.request({
                url: 'https://xyeyyhyxk.top:8881/login/up',
                data: {code:res.code},
                method: 'get',
                success: (res)=>{
                  console.log('token:'+res.data.data);
                  wx.setStorageSync('token', res.data.data);
                },
              });
            }
          })
       }
    }
})