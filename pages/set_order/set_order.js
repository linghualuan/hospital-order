import { request } from '../request/request'
Page({

  data: {
    projectList:[], //项目列表
    a:[]  //要删除的项目名
  },

  onLoad(options) {
    this.getProject()
  },

  QueryParams:{
    pageNumber:1,
    pagesize:10
  },

  //总的页数
  totalPage:1,

  //搜索功能
  handleSearch(e){
    let orderProject = e.detail.value;
    request({url:'/superRoot/project/getProjectList',data:{orderProject}})
    .then(
      res => {
        if(res.data.code === 1){
          let projectList = res.data.data.records;
          this.setData({projectList})
          console.log(this.data.projectList);
        }else{
          this.setData({projectList:[]})
        }
      }
    )
  },

  // 获取医院项目数据
  async getProject() {
    const res = await request({url:'/superRoot/project/getProjectList'})
    if(res.data.code === 1){
      this.setData({
        projectList:[...res.data.data.records]
      })
      console.log(this.data.projectList);
    }
  },

  //长按删除
  handleDelete(e){
    let index = e.currentTarget.dataset.index;
    let projectList = this.data.projectList;
    for(let i=0 ; i<projectList.length ; i++){
      if(index === i){
        var a = projectList[i].orderProject;
        this.setData({a})
      }
    }
    if(this.data.a){
      wx.showModal({
        title:'提示',
        content:'是否删除',
        success:res => {
          if(res.confirm){
            console.log(a);
            request({url:'/superRoot/project/deleteNewProject',data:{project:this.data.a}})
            .then(
              res => {
                console.log(res);
                let msg = res.data.msg;
                if(res.data.code === 1){
                  wx.showToast({
                    title: msg,
                  })
                  let projectList = this.data.projectList.filter((v,i) => {
                    return v.orderProject !== this.data.a
                  })
                  this.setData({projectList})
                }else{
                  wx.showToast({
                    title: msg,
                    icon:'none'
                  })
                }
              }
            )
          }else{
            console.log('用户点击取消');
          }
        }
      })
    }
  }
})