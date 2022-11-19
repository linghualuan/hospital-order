import { request } from '../request/request'
Page({

    data: {
        note:'',    //备注
        orderPeople:'', //预约人数
        orderProject:'',    //项目名称
        pendCheck:'',   //检查等待时间
        pendWait:'', //注射等待时间
        peopleNum:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]
    },

    //搜索框输入
    handleProject(e){
        console.log(e);
        let orderProject = e.detail.value;
        this.setData({orderProject});
    },

    //注射后等待时长
    handlePendWait(e){
        let pendWait = e.detail.value;
        this.setData({pendWait});
        console.log(this.data.pendWait);
    },

    //检查时长
    handlePendCheck(e){
        let pendCheck = e.detail.value;
        this.setData({pendCheck});
        console.log(this.data.pendCheck);
    },

    //可预约人数
    handleOrderNumber(e){
      let orderPeople = this.data.peopleNum[e.detail.value]
      this.setData({orderPeople})
    },

    //获取备注
    handleNote(e){
        let note = e.detail.value;
        this.setData({note})
    },

    //提交
    handleSubmit(){
        let note = this.data.note;
        let orderPeople = this.data.orderPeople;
        let orderProject = this.data.orderProject;
        let pendCheck = this.data.pendCheck;
        let pendWait = this.data.pendWait;
        if(!orderPeople || !orderProject || !String(pendCheck) || !String(pendWait) || !note){
            wx.showToast({
                title:'请输入完整信息',
                icon:'none'
            })
        }else{
            request({
                url:'/superRoot/project/addNewProject',
                data:{note,orderPeople,orderProject,pendCheck,pendWait}
            })
            .then(
                res => {
                    console.log(res);
                    if(res.data.code === 1){
                        wx.showToast({
                            title: '添加项目成功',
                            icon: 'none',
                        });
                        this.setData({
                            note:'',
                            orderPeople:'',
                            orderProject:'',
                            pendCheck:'',
                            pendWait:''
                        })
                    }else{
                        wx.showToast({
                            title: '添加项目失败',
                            icon: 'none',
                        });
                    }
                }
            )
        }
    }
})