import { request } from '../request/request'
Page({
  data: {
      tabs:[
          {
              id:1,
              value:"进行中",
              isActive:true
          },
          {
              id:2,
              value:"已完成",
              isActive:false
          }
      ],
      projectItem:[]
  },

  getObject(){
    request({url:'/superRoot/project/getProjectList'})
    .then(
      res => {
        console.log(res);
        this.setData({
          projectItem: res.data.data.records
        })
      }
    )

  },

  onLoad(){
    // 获取对应数据
    this.getObject()
  },
})