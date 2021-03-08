<template>
    <div class="attachment_div">

        <div class="content">
            <div v-for="(item,index) in attachmentContent" style="border-bottom: 1px solid #eeeeee;">
                <div class="en_title" @click="set_aId(index)"> {{item.title}}  <i v-if="aId==index" class="iconfont icontubiao-13"></i></div>
                <div v-if="aId==index">
                    <div class="item_div" v-for="i in item.contents.filter(i => i.type ==='TEXT')">
                        <p class="item_title">{{i.title}}</p>
                        <p class="item_detail">{{i.content}}</p>
                    </div>
                    <div class="item_div"  v-for="i in item.contents.filter(i => i.type ==='IMAGE')">
                        <p class="item_detail">
                            <img :src="globalConfig.imagePath + i.extra"/>
                        </p>
                        <p class="item_detail">{{i.content}}</p>
                    </div>
                    <div class="item_div" v-for="i in item.contents.filter(i => i.type ==='VIDEO')">
                        <p class="item_detail">
                            <video width="100%" :src="globalConfig.imagePath + i.extra" controls="controls"/>
                        </p>
                        <p class="item_detail">{{i.content}}</p>
                    </div>
                    <div class="item_div" v-for="i in item.contents.filter(i => i.type ==='HTML')">
                        <p class="item_detail">{{i.content}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "inspection",
        props: {
            hotspotContent: {
                type: Array,
                default: []
            },
            aId:0,
        },
        methods:{
            close(){
                this.$emit("close_content");
            },
            replace(val){
                return val.replace(/↵/g,"\n");
            },
            set_aId(index){
                if(this.aId==index){
                    this.aId=-1
                }else{
                    this.aId=index
                }
            }
        }
    };
</script>

<style lang="less">
    .attachment_div {
        width: 100%;
        height: 100%;
        margin-left: 0px;
        margin-top: 0px;
        background: rgba(255,255,255,1);
        overflow-y: scroll;
        pointer-events:auto;
        .content{
            padding: 15px 15px;
            width: 100%;
            //height:100%;
            //max-width: 800px;
            //margin: auto;
            background-color: rgba(255,255,255,1);
        }
        .title{
            position: absolute;
            z-index: 1000;
            height: 40px;
            background-color: #FFFFFF;
            border-radius: 2px;
            margin-top: 2px;
            margin-left: 0px;
            padding-left: 8px;
            span{
                font-size: 16px;
                margin-right: 20px;
                line-height: 40px;
            }
            img{
                margin-top:12px ;
                width:16px;
                height:16px;
                margin-right: 20px;
                cursor: pointer;
            }
        }
        .tech_title{
            font-size: 16px; font-weight: bold; padding: 0px 0px; margin-top: 60px;
        }
        .item_div{
            margin-top: 5px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
            margin-bottom: 20px;
            .item_title{
                font-size: 14px; font-weight: bold; line-height: 28px;
            }
            .item_detail{
                font-size: 14px;
                line-height: 28px;
                white-space: pre-line;
                img{
                    width: 100%;
                    border-radius: 2px;
                }
            }
        }

    }
</style>