Page({
    data: {
        time:[
            {a:'08:00-10:00',num:'10'},
            {a:'09:00-11:00',num:'30'},
            {a:'12:00-13:00',num:'5'},
            {a:'14:00-17:00',num:'10'},
            {a:'17:00-19:00',num:'40'},
        ]
    },

    handleHome(){
        wx.redirectTo({
            url:'../my_project/my_project'
        })
    },
})