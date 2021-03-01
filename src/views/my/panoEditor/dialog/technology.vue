<template>
    <div class="technology_div">

        <div class="title">
            <span>云船码头技术解读卡</span>
            <img src="../images/icon_en.png"/>
            <img src="../images/icon_pro.png"/>
            <img src="../images/icon_ser.png"/>
            <img src="../images/icon_link.png"/>
            <img src="../images/icon_contact.png"/>
            <img src="../images/icon_pano.png" @click="close"/>
        </div>
        <div class="content">
            <div class="item_div" v-for="item in hotspotContent.filter(item => item.type ==='TEXT')">
                <p class="item_title">{{item.title}}</p>
                <p class="item_detail">{{item.content}}</p>
            </div>
            <div class="item_div"  v-for="item in hotspotContent.filter(item => item.type ==='IMAGE')">
                <p class="item_detail"><img :src="globalConfig.imagePath + item.extra"/></p>
                <!--p class="item_title">{{item.title}}</p-->
                <p class="item_detail">{{item.content}}</p>
            </div>
            <div class="item_div" v-for="item in hotspotContent.filter(item => item.type ==='VIDEO')">
                <p class="item_detail">
                    <video width="100%" :src="globalConfig.imagePath + item.extra" controls="controls"/>
                </p>
                <!--p class="item_title">{{item.title}}</p-->
                <p class="item_detail">{{item.content}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "technology",
        props: {
            hotspotContent: {
                type: Array,
                default: []
            }
        },
        methods:{
            close(){
                this.$emit("close_content");
            }
        }
    };
</script>

<style lang="less">
    .technology_div {
        width: 460px;
        height: 100%;
        margin-left: 0px;
        margin-top: 0px;
        background: rgba(245,245,245,1);
        overflow-y: scroll;
        pointer-events:auto;
        .content{
            padding: 10px 30px;
            margin-top: 50px;
            width: 450px;
            //height:100%;
            //max-width: 800px;
            //margin: auto;
            background-color: rgba(245,245,245,1);
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
            margin: 15px 0px;
            border-bottom: 1px solid #eee;
            margin-bottom: 10px;
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