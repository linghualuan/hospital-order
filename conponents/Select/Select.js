Component({
    properties: {
        select:{
            type:Array,
            value:[]
        }
    },

    data: {
        isSelect:false,
        info:'请选择',  //选框显示的信息
        selectDate:'',   //用户选择的时间段
        lengthSelect:[]
    },
    methods: {

        handleLengthSelect(){
            let lengthSelect = this.properties.select;
            this.setData({lengthSelect})
        },

        handleTap(){
            let isSelect = this.data.isSelect;
            isSelect = !isSelect;
            this.setData({
                isSelect
            })
            this.handleLengthSelect()
        },

        handleSelect(e){
            console.log(e);
            let index = e.currentTarget.dataset.index;
            this.triggerEvent("selectChange",index);
            let isSelect = this.data.isSelect;
            let select = this.properties.select;
            let info = this.data.info;
            info = select[index]
            isSelect = !isSelect;
            this.setData({
                isSelect,info
            })
        },
    },
    // pageLifetimes:{
    //     show(){
    //         this.handleLengthSelect()
    //     }
    // }
})

