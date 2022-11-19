export const request = (params)=>{
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            // url: 'http://124.71.81.190:8881'+params.url,
            url: 'https://xyeyyhyxk.top:8881'+params.url,
            // url: 'https://139.159.238.21:8881'+params.url,
            data:params.data,
            method:params.method,
            success(result){
                resolve(result);
            },
            fail:(response)=>{
                reject(response)
            }
        });
    })
}

//显示正在加载图标的请求
let ajaxTimes = 0;
export const requestLoading = (params)=>{
    ajaxTimes++

    wx.showLoading({
      title: '加载中',
      mask:true
    })
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            url: 'https://xyeyyhyxk.top:8881'+params.url,
            data:params.data,
            method:params.method,
            
            success: (result)=>{
                resolve(result);
            },
            fail:(response)=>{
                reject(response)
            },
            complete:() => {
                ajaxTimes--
                if(ajaxTimes === 0){
                    wx.hideLoading()
                }
            }

        });
    })
}