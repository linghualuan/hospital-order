import { request } from '../request/request'
Page({

    data: {
        medicalCard:'',
        name:'',
        sex:'',
        age:'',
        tel:'',
        project:'',
        turnTime:'',
        finishTime:'',
        status: 0
    },

    QueryParams:{
        id:''
    },

    handleUserInfo(){
        let id = this.QueryParams.id;
        request({url:'/technician/getDetailScan',data:{id}})
        .then(
            res => {
                console.log(res);
                let data = res.data.data;
                let medicalCard = data.medicalCard;
                let name = data.name;
                let sex = data.sex;
                let age = data.age;
                let tel = data.tel;
                let project = data.project;
                let turnTime = data.turnTime;
                let errorMsg = data.errorMsg;
                let finishTime = data.finishTime;
                this.setData({
                    medicalCard, 
                    name, 
                    sex, 
                    age, 
                    tel, 
                    project, 
                    turnTime,
                    errorMsg,
                    finishTime
                })
            }
        )
    },

    onLoad(option){
      this.setData({
        status: option.status
      })
        this.QueryParams.id = option.id;

        this.handleUserInfo();
    }
})