import { request } from "../request/request";
Page({
	data: {
		startDate: "", //开始日期
		endDate: "", //结束日期
		orderNumber: 0, //预约数量
		showStartDate: false, //开始日历的关闭或显示
		showEndDate: false, //结束日历的关闭或显示
		timeList: [{}], //把预约时段、预约数量赋值给timeList数组
		indexNumber: 0, //预约数量的下标
		dateList: [], //向后台发送的日期
		orderDate: [], //设置可预约的日期
	},

	QueryParams: {
		orderProject: "",
	},

	//显示页面最顶层的项目名称
	handleProject() {
		let orderProject = this.QueryParams.orderProject;
		this.setData({ orderProject });
	},

	//点击日期确认
	confirmDate(e) {
		console.log(e);
		let orderDate = e.detail.map((v) => {
			return `${v.getFullYear()}-${v.getMonth() + 1 < 10 ? '0' + v.getMonth() + 1 : v.getMonth() + 1}-${v.getDate() < 10 ? '0' + v.getDate() : v.getDate()}`;
		});
		this.setData({ orderDate });
		wx.showToast({
			title: "选择日期成功",
			icon: "none",
		});
	},

	onLoad(options) {
		this.QueryParams.orderProject = options.orderProject;
		//定义初始timeList数组
		let timeList = new Array(1);
		let item = { startTime: "", endTime: "", number: 0 };
		timeList[0] = item;
		this.setData({ timeList });
		this.handleProject();
	},

	//显示开始日期的日历表
	handleStartDate() {
		this.setData({ showStartDate: true });
	},

	//显示结束日期的日历表
	handleEndDate() {
		this.setData({ showEndDate: true });
	},

	//点击确认关掉开始日历表
	onCloseStartDate() {
		this.setData({ showStartDate: false });
	},

	//点击确认关掉结束日历表
	onCloseEndDate() {
		this.setData({ showEndDate: false });
	},

	formatDate(date) {
		date = new Date(date);
		return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1
			}-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;
	},

	//------------------------------------------------------------------------------

	//显示具体开始日期
	onConfirmStart(event) {
		this.setData({
			showStartDate: false,
			startDate: this.formatDate(event.detail),
		});
	},

	//显示具体结束日期
	onConfirmEnd(event) {
		this.setData({
			showEndDate: false,
			endDate: this.formatDate(event.detail),
		});
	},

	//显示开始的预约时段
	bindTimeChangeStart(e) {
		let index = e.currentTarget.dataset.index;
		let timeList = this.data.timeList;

		//定义timelist中的每一项
		timeList[index].startTime = e.detail.value;
		this.setData({ timeList });

		console.log(this.data.timeList);
		this.setData({ startTime: e.detail.value });
	},

	//显示结束的预约时段
	bindTimeChangeEnd(e) {
		let index = e.currentTarget.dataset.index;
		let timeList = this.data.timeList;
		timeList[index].endTime = e.detail.value;
		this.setData({ timeList });
		this.setData({ endTime: e.detail.value });
	},

	//预约数量
	onChange(e) {
		let index = e.currentTarget.dataset.index;
		let timeList = this.data.timeList;
		timeList[index].number = e.detail;
		this.setData({ timeList });
	},

	//------------------------------------------------------------------------------

	//添加时间段
	add_time() {
		let timeList = this.data.timeList;
		let item = { startTime: "", endTime: "", number: 0 };
		let a = timeList[timeList.length - 1];
		if (!a.startTime || !a.endTime || a.number === 0) {
			wx.showToast({
				title: "请填写完整信息",
				icon: "none",
			});
		} else {
			timeList.push(item);
			this.setData({ timeList });
		}
	},

	//点击发送预约
	creatProject() {
		let dates = this.data.orderDate; // 可预约日期
		let timeList = this.data.timeList;
		let project = this.QueryParams.orderProject;
		let times = [];
		let sum = 0;
		timeList.forEach((v, i) => {
			times[i] = { perTime: `${v.startTime}-${v.endTime}`, numbers: v.number };
			sum += v.number;
		});
		//数组中若有开始时间段小于结束时间段则返回false，否则返回true
		let isTime = timeList.every((item) => {
			let startTime1 = item.startTime.slice(0, 2);
			let startTime2 = item.startTime.slice(3, 5);
			let endTime1 = item.endTime.slice(0, 2);
			let endTime2 = item.endTime.slice(3, 5);
			return parseInt(startTime1 + startTime2) < parseInt(endTime1 + endTime2);
		});

		if (dates.length === 0) {
			wx.showToast({
				title: "日期不能为空",
				icon: "none",
			});
		} else {
			if (!isTime) {
				wx.showToast({
					title: "预约开始时段必须小于预约结束时段",
					icon: "none",
				});
			} else {
				console.log('dates',dates);
				console.log('sum',sum);
				console.log('project',project);
				console.log('times',times);
				request({
					url: "/superRoot/setting/settingDate",
					data: { dates, times, project, sum },
					method: "post",
				}).then((res) => {
					console.log("res", res);
					if (res.data.code === 1) {
						wx.showToast({
							title: "创建成功",
							icon: "none",
						});
						setTimeout(() => {
							wx.navigateBack({
								url: "../set_order/set_order",
							});
						}, 1000);
					} else {
						let msg = res.data.msg;
						wx.showToast({
							title: msg,
							icon: "none",
						});
					}
				});
			}
		}
	},
});
