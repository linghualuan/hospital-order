
Component({
    properties: {
        tabs:{
            type:Array,
            value:[]
        }
    },

    data: {

    },

    methods:{
        handleTab(e){
            const index = e.currentTarget.dataset.index;
            this.triggerEvent("itemTabChange",index);
        }
    }
})
