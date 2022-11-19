import { request } from '../request/request'
Page({
    data: {
        content: []
    },

    handleGetText() {
        request({url: '/serve/project/getText'}).then(res => {
            let content = res.data.data.messageText.split(('。' + '\n') || (' ' + '\n') || ('!' + '\n') || ',' + '\n' || '.' + '\n' || '，' + '\n' ('！' + '\n') || ('"') + '\n' || ('”' + '\n'));
            this.setData({content})
        })
    },

    onLoad() {
        this.handleGetText()
    }
})