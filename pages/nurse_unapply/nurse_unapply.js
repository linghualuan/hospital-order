import { request } from '../request/request'
Page({

    data: {
        age:'',
        medicalCard:'',
        name:'',
        orderDate:'',
        orderProject:'',
        orderTime:'',
        relId:'',
        sex:'',
        tel:'',
        errorMsg:''
    },

    QueryParams:{
        medicalCard:'',
        id:''
    },

    //展示用户信息
    handleShowUserInfo(){
        let medicalCard = this.QueryParams.medicalCard;
        let id = this.QueryParams.id;
        request({url:'/infoCommit/orderDetail',data:{medicalCard,id},header:{'Authorization':'Bearer ' + wx.getStorageSync('token')}})
        .then(
            res => {
                let a = res.data.data;
                let medicalCard = a.medicalCard;
                let name = a.name;
                let orderDate = a.orderDate;
                let orderProject = a.orderProject;
                let orderTime = a.orderTime;
                let relId = a.relId;
                let sex = a.sex;
                let tel = a.tel;
                let errorMsg = a.remark;
                this.setData({  medicalCard, errorMsg, name, orderDate, orderProject, orderTime, relId, sex, tel })
            }
        )
    },

    onLoad(option){
        this.QueryParams.medicalCard = option.medicalCard;
        this.QueryParams.id = option.id;
        this.handleShowUserInfo();
    }
})