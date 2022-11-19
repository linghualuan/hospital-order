import { request } from "../request/request";
Page({
  data: {
    totalNum: 100, //总预约数量
    canNum: [], //还可预约数量
    types: [], //每个项目的可预约的日期
    index: 0,
    times: [],
    addItem: false,
    numberList: [],
    datePost: "", //需要向后台提交的日期
    allTimeItem: [], //所有日期的所有时间段
    orderProject: "",
    showDate: false,
    changeNumber: "",
    time: [], //当前日期可预约的时间段
  },

  QueryParams: {
    orderProject: "",
  },

  showDate() {
    this.setData({
      showDate: true,
    });
  },

  //   //点击下拉框获取日期
  handleChangeTime(e) {
    let index = e.detail;
    let date = this.data.types;
    let datePost = date[index];
    this.setData({ datePost });
    let times = this.data.times;
    for (let i = 0; i < date.length; i++) {
      if (this.data.datePost === date[i]) {
        let time = [];
        time = times[i];
        this.setData({ time });
      }
    }
  },

  handleInp(e) {
    let time = this.data.time;
    let index = this.data.index;
    for (let i = 0; i < time.length; i++) {
      if (index === i) {
        time[i].allNumber = parseInt(e.detail.value);
      }
    }
  },

  // 点击提交按钮
  handleSubmit() {
    let projectName = this.QueryParams.orderProject;
    let times = this.data.time;
    console.log("times", times);
    request({
      url: "/superRoot/setting/updateTimeAndNumber",
      data: { projectName, times },
      method: "post",
    }).then((res) => {
      console.log(res);
      if (res.data.code === 1) {
        wx.showToast({
          title: "修改成功",
          icon: "none",
        });
      } else if (res.data.code === 2) {
        let a = res.data.msg;
        wx.showToast({
          title: a,
          icon: "none",
        });
        setTimeout(() => {
          this.handleItemDate();
        }, 700);
      }
    });
  },

  //获取默认要上传的时间
  handleDefaultDatePost() {
    let date = this.data.types;
    let datePost = date[0];
    this.setData({ datePost });
  },

    //页面初始加载获取数据
    handleItemDate() {
      let projectName = this.QueryParams.orderProject;
        request({
        url: "/superRoot/setting/getDateTimeNumber",
        data: { projectName },
        }).then((res) => {
        let date = new Date()
        let [nowYear,nowMonth,nowDay] = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
        // 过滤，过滤掉日期小于当前日期的项
        let canSelectDate = res.data.data.filter(v => {
            return parseInt(v.date.split('-').join('')) > parseInt(`${nowYear}${nowMonth < 10 ? '0'+nowMonth : nowMonth}${nowDay < 10 ? '0'+nowDay : nowDay}`)
        })
        let types = canSelectDate.map(v => {
            return v.date
        })
        this.setData({ types });
        this.handleDefaultDatePost();
        let times = canSelectDate.map(v => {
            return v.times
        });
        this.setData({ times });
        let time = [];
        time = this.data.times[0];
        this.setData({ time });
    });
  },

  //获取每天每个时间段的下标
    handleShowIndex(e) {
        let index = e.detail.current;
        this.setData({ index });
    },

    //改变日期   
  onDataChange(e) {
    this.setData({
      changeNumber: e.detail.value,
    });
  },

//   关闭弹出层
  onClose(e) {
    this.setData({
      showDate: false,
      datePost: this.data.changeNumber || this.data.types[0],
    })
    console.log(this.data.times)
    let index = this.data.types.findIndex((item) => {
      return item === this.data.datePost;
    })
    let time = this.data.times[index]
    this.setData({ time })
    console.log("types", this.data.types)
    console.log("times", this.data.times)
  },

  onLoad(option) {
    this.setData({ orderProject: option.orderProject })
    this.QueryParams.orderProject = option.orderProject
    this.handleItemDate()
  },
});
