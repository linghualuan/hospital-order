import { request } from '../request/request'
Page({
	data: {
		userInfo: []
	},

	//是否删除
	handleRelieve(e){
		console.log(e);
		let index = e.currentTarget.dataset.index
		let id = e.currentTarget.dataset.id
		let agree = e.currentTarget.dataset.status

		wx.showModal({
			title:'提示',
			content:agree == 0 ? '是否拒绝' : '是否同意',
			success:res => {
				if(res.confirm){
					request({url:'/infoCommit/isAgree',data:{ id, agree },method:'GET'})
					.then(
						res => {
							console.log(res);
							if(res.data.code === 1){
								let msg = res.data.msg;
								//过滤数组
								let userInfo = this.data.userInfo.filter((v,i) => {
									return index !== i;
								})
								this.setData({userInfo})
								wx.showToast({
									title: msg,
									icon:'none'
								})
							}else{
								wx.showToast({
									title: '操作失败'
								})
							}
						}
					)
				}
			}
		})
	},

	handleUserInfo() {
		request({
			url: '/infoCommit/cancelList',
			method: 'GET',
			data: {apply: 1},
			
		}).then(res => {
			this.setData({
				userInfo: res.data.data
			})
			console.log('userInfo',this.data.userInfo);
		})
	},

	onLoad() {
		this.handleUserInfo()
	}
})
