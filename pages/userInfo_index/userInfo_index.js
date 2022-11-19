import { request } from '../request/request'
Page({
    data: {
        medicalCard:'',
        name:'',
        sex:'',
        tel:'',
        sexSelect:['男','女'],
        isLogin: true
    },

    //判断数据库是否存有用户信息
    checkDistance() {
        request({url:'/login/checkConsumer',data:{token:wx.getStorageSync('token')}})
        .then(
            res => {
                if(res.data.code === 1) {
                    let isLogin = true
                    this.setData({isLogin})
                    wx.setStorageSync('medicalCard', res.data.data.medicalCard)
                    wx.setStorageSync('name', res.data.data.name)
                    wx.setStorageSync('relId', res.data.data.relId)
                    wx.setStorageSync('tel', res.data.data.tel)
                    wx.setStorageSync('sex', res.data.data.sex)
                    this.onShow()
                }else {
                    let isLogin = false
                    this.setData({isLogin})
                }
            }
        )
    },

    handlePendSex(e){
        let sex;
        let index = e.detail.value;
        if(index === '0'){
            sex = '男'
        }else{
            sex = '女'
        }
        this.setData({sex})
    },

    onShow(){
        this.checkDistance()
        let medicalCard = wx.getStorageSync('medicalCard');
        let name = wx.getStorageSync('name');
        let sex = wx.getStorageSync('sex');
        let tel = wx.getStorageSync('tel');
        this.setData({
            medicalCard,name,sex,tel
        })
    },

    //提交修改的信息
    handleSubmit(){
        let medicalCard = this.data.medicalCard;
        let name = this.data.name;
        let sex = this.data.sex;
        let tel = this.data.tel;
        let relId = wx.getStorageSync('relId');

        //--------------------------------------
        //正则表达式
        let Name = /^[\u2E80-\u9FFF]+$/;
        let Sex = /^[男|女]{1}$/;
        let Tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        //--------------------------------------

        if(name.trim().length > 0 && medicalCard.trim().length > 0 && sex.trim().length > 0 && tel.trim().length > 0){
            if(!Name.test(name)){
                wx.showToast({
                    title:'名字不合法',
                    icon:'none'
                })
            }else if(!Sex.test(sex)){
                wx.showToast({
                    title:'性别不合法',
                    icon:'none'
                })
            }else if(!Tel.test(tel)){
                wx.showToast({
                    title:'电话号码不合法',
                    icon:'none'
                })
            }else{
                request({url:'/serve/relation/updateInfo',
                         data:{medicalCard,name,sex,tel,relId},
                         method:'post',
                         header:{'Authorization':'Bearer ' + wx.getStorageSync('token')},
                        })
                .then(
                    res => {
                        console.log(res);
                        if(res.data.code === 1){
                            wx.setStorageSync('medicalCard', this.data.medicalCard);
                            wx.setStorageSync('name', this.data.name);
                            wx.setStorageSync('sex', this.data.sex);
                            wx.setStorageSync('tel', this.data.tel);
                            wx.showToast({
                                title:'更改成功',
                                icon:'none'
                            })
                            setTimeout(() => {
                                wx.navigateBack({
                                  url: '../index/index',
                                })
                            },1000)
                        }else{
                            wx.showToast({
                                title:'更改失败',
                                icon:'none'
                            })
                        }
                    }
                )
            }
        }else{
            wx.showToast({
                title:'必填信息不能为空',
                icon:'none'
            })
        }
    },

        //获取就诊卡号
        handleMedicalCard(e){
            let medicalCard = e.detail.value;
            this.setData({
                medicalCard
            })
        },

        //获取患者姓名
        handleName(e){
            let name = e.detail.value;
            this.setData({
                name
            })
        },

        //获取患者电话
        handleTel(e){
            let tel = e.detail.value;
            this.setData({
                tel
            })
        },

        //点击登录跳转到登录页面
        handleLogin() {
            wx.navigateTo({
              url: '../userInfo/userInfo',
            })
            this.onShow()
        },

        onLoad() {
            this.checkDistance()
        }
})