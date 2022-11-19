import { request } from '../request/request'
Page({
    data: {
        types:['预约护士','注射护士','检查技师'],      //选择创建身份
        select:'',       //确认选择的身份
        jobNum:'',  //管理账号
        name:'',     //管理员姓名
        password:'',    //密码
        sex:'',     //性别
        tel:'',     //电话
        workName:'',     //身份
        sexSelect:['男','女']
    },

    handleSelectChange(e){
        let index = e.detail;
        let workName = '';
        let types = this.data.types;
        workName = types[index];
        this.setData({ workName })
    },

    // 工号
    handleJobNum(e){
        let jobNum = e.detail.value;
        this.setData({jobNum})
    },

    //姓名
    handleName(e){
        let name = e.detail.value;
        this.setData({name})
    },

    //性别
    handleSex(e){
        let sex;
        if(e.detail.value === '0'){ 
          sex = '男'  
        }else{
          sex = '女'
        }
        this.setData({sex})
    },

    //电话
    handleTel(e){
        let tel = e.detail.value;
        this.setData({tel})
    },

    //密码
    handlePwd(e){
        let password = e.detail.value;
        this.setData({password})
    },

    //提交
    handleSubmit(){
        let jobNum = this.data.jobNum;
        let name = this.data.name;
        let password = this.data.password;
        let sex = this.data.sex;
        let tel = this.data.tel;
        let workName = this.data.workName;
        console.log('workName',workName);
        if(!workName){
            let workName = '预约护士'
            this.setData({workName})
        }else{
            let workName = this.data.workName
            this.setData({workName})
        }

        if(!jobNum || !name || !password || !sex || !tel || !workName){
            wx.showToast({
              title: '请输入完整内容', icon:'none'
            })
        }else{
            let Name = /^[\u2E80-\u9FFF]+$/;
            let Sex = /^[男|女]{1}$/;
            let Tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
            if(!Name.test(name) || !Sex.test(sex) || !Tel.test(tel)){
                wx.showToast({
                  title: '请输入正确的信息',
                  icon:'none'
                })
            }else{
                request({url:'/superRoot/people/addNewDoctor',data:{jobNum,name,password,sex,tel,workName}})
                .then(
                    res => {
                        console.log(res);
                        if(res.data.code === 1){
                            wx.showToast({
                              title: '新增成功',
                              icon:'none'
                            })
                            setTimeout(() => {
                                this.setData({jobNum:'',name:'',sex:'',tel:'',password:''})
                            },500)
                        }else{
                            let msg = res.data.msg;
                            wx.showToast({
                              title: msg,
                              icon:'none'
                            })
                        }
                    }
                )
            }
        }
    }
})