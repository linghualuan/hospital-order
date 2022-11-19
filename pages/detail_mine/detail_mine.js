import { request } from '../request/request'
Page({
    data: {
        orderDate:'',
        orderTime:'',
        orderProject:''
    },

    QueryParams:{
        id:''
    },

    handleUserInfo(){
        let id = this.QueryParams.id;
        request({url:'/serve/check/orderDetail',data:{id}})
        .then(
            res => {
                console.log(res);
                let orderDate = res.data.data.orderDate;
                let orderTime = res.data.data.orderTime;
                let orderProject = res.data.data.orderProject;
                this.setData({orderDate,orderTime,orderProject})
            }
        )
    },

    onLoad(option){

        console.log(option);

        this.QueryParams.id = option.id

        this.handleUserInfo()
    }
})