import { request } from '../request/request'
Page({
    data: {
        //富文本框显示的内容
        content: ''
    },

    //富文本框输入的内容
    handleInput(e) {
        this.setData({content: e.detail.value})
    },

    //提交修改
    handleSubmit() {
        let text = this.data.content
        request({url: '/superRoot/project/upLoadText',data:{text},method: 'post'}).then(res =>{
            if(res.data.code === 1) {
                wx.showToast({
                  title: '修改成功',
                  type:'success'
                })
            }
        })
    },

    handleGetText() {
        request({url: '/serve/project/getText'}).then(res =>{
            this.setData({content: res.data.data.messageText})
        })
    },

    onLoad() {
        this.handleGetText()
    }
})