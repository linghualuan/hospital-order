import { request } from '../request/request'
Page({
  data: {
    tabs: [
      {
        id: 1,
        value: "预约护士",
        isActive: true
      },
      {
        id: 2,
        value: "注射护士",
        isActive: false
      },
      {
        id: 3,
        value: "技术员",
        isActive: false
      },
      {
        id: 4,
        value: "患者用户",
        isActive: false
      }
    ],
    orderNurse:[],
    injectNurse:[],
    technician:[],
    userInfo:[],
    showPopup: false,  //是否弹出筛选框
    value: '',  //用户筛选时输入的项目名称
    showDateSelect: false,  //点击筛选日期显示日历
    date: '',  //用户选择的日期
    condition: '' //筛选时选择的状态
  },

  // 用户搜索
  handleSearch(e) {
    request({
      url: '/superRoot/people/searchUser', 
      method: 'GET', 
      data: {search: e.detail}
    }).then(res => {
      this.setData({ userInfo: res.data.data })
    })
  },

  // 显示弹出层
  showPopup() {
    this.setData({
      showPopup: true
    })
  },

  //关闭弹出层
  onClose() {
    this.setData({
      showPopup: false
    })
  },

  handleItemTabChange(e) {
    let index = e.detail;
    let tabs = this.data.tabs;
    tabs.forEach((v, i) => { i === index ? v.isActive = true : v.isActive = false })
    this.setData({tabs})
    if(index === 0){
      this.handleOrderNurse()
    }else if(index === 1){
      this.handleInjectNurse()
    }else if(index === 2){
      this.handleTechnician()
    }else{
      this.handleUserInfo()
    }
    
  },

  //显示日期筛选
  showDateSelect() {
    this.setData({
      showDateSelect: true
    })
  },

  onCloseDate() {
    this.setData({
      showDateSelect: false
    })
  },

  // 用户点击日历确认
  onConfirmDate(e){
    let detail = e.detail
    let [year,month,day] = [detail.getFullYear(),detail.getMonth() + 1, detail.getDate()]
    console.log(`${year}-${month}-${day}`);
    this.setData({
      date: `${year}-${month}-${day}`,
      showDateSelect: false
    })
  },

  //点击状态筛选条件
  clickItem(e) {
    let index = e.currentTarget.dataset.item.id
    let selectCondition = this.data.selectCondition
    selectCondition.forEach(v => {
      v.isActive = false
    })
    selectCondition[index].isActive = true
    let condition = selectCondition[index].value
    this.setData({
      selectCondition,
      condition
    })
  },

  // 获得用户筛选的项目
  getUserInput(e) {
    this.setData({
      value: e.detail.value
    })
  },

  //获取预约护士信息
  handleOrderNurse(){
    request({url:'/superRoot/project/getDifferentDoctor',data:{number:1}})
    .then(
      res => {
        let records = res.data.data;
        let orderNurse = [];
        for(let i =0;i<records.length;i++){
          orderNurse[i] = records[i]
        }
        this.setData({ orderNurse })
      }
    )
  },

  //获取注射护士信息
  handleInjectNurse(){
    request({url:'/superRoot/project/getDifferentDoctor',data:{number:2}})
    .then(
      res => {
        let records = res.data.data;
        let injectNurse = [];
        for(let i =0;i<records.length;i++){
          injectNurse[i] = records[i]
        }
        this.setData({ injectNurse })
      }
    )
  },

  //获取技术员信息
  handleTechnician(){
    request({url:'/superRoot/project/getDifferentDoctor',data:{number:3}})
    .then(
      res => {
        let records = res.data.data;
        let technician = [];
        for(let i =0;i<records.length;i++){
          technician[i] = records[i]
        }
        this.setData({ technician })
      }
    )
  },

  //获取患者信息
  handleUserInfo(){
    request({url:'/superRoot/project/getDifferentDoctor',data:{number:4}})
    .then(
      res => {
        let records = res.data.data;
        let userInfo = [];
        for(let i =0;i<records.length;i++){
            userInfo[i] = records[i]
        }
        this.setData({ userInfo })
      }
    )
  },

  //提交筛选，点击确认按钮
  submit() {
    let [value,date,condition] = [this.data.value, this.data.date, this.data.condition]
    console.log(value,date,condition);
    this.setData({
      showPopup: false
    })
  },

  onShow(){
    this.handleOrderNurse();
    this.handleInjectNurse();
    this.handleTechnician();
  }
})