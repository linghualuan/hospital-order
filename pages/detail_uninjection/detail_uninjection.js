import { request } from '../request/request'
Page({
    data: {
        medicalCard:'',
        name:'',
        sex:'',
        tel:'',
        project:'',
        position:'',
        dose:'', //注射计量
        date:'',
        errorMsg:'',  //失败原因
        status: 0
    },

    QueryParams:{
        id:''
    },

    handleInfo(){
        let id = this.QueryParams.id;
        request({url:'/nurseInjection/injectionDetail',data:{id}})
        .then(
            res => {
                console.log(res);
                this.setData({
                    medicalCard:res.data.data.medicalCard,
                    name:res.data.data.name,
                    sex:res.data.data.sex,
                    tel:res.data.data.tel,
                    project:res.data.data.project,
                    position:res.data.data.position,
                    dose:res.data.data.dose,
                    date:res.data.data.date,
                    errorMsg:res.data.data.errorMsg
                })
            }
        )
    },


    onLoad(option){
      console.log(option);
      this.setData({
        status: option.status
      })
        this.QueryParams.id = option.id;
        this.QueryParams.medicalCard = option.medicalCard;
        this.QueryParams.project = option.project;
        this.handleInfo()
    }
})