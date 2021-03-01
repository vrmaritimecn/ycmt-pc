<template>
    <div class="organization_div">
        <div class="content">
            <div class="title">
                <span>云船码头机构网络通道链接</span>
                <img src="../images/icon_en.png"/>
                <img src="../images/icon_pro.png"/>
                <img src="../images/icon_ser.png"/>
                <img src="../images/icon_link.png"/>
                <img src="../images/icon_contact.png"/>
                <img src="../images/icon_pano.png" @click="close"/>
            </div>
            <div class="carousel_div">
                <el-carousel :interval="4000" type="card" height="200px" v-for="item in attachmentContent.filter(item => item.title ==='轮播图')" :key="item.id">>
                    <el-carousel-item v-for="i in item.contents" :key="i.id">
                        <img :src="globalConfig.imagePath + i.extra" class="carousel-image">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div style="font-size: 14px; line-height: 21px">
                <el-row :gutter="12" v-for="item in attachmentContent.filter(item => item.title ==='官方链接')" :key="item.id">
                    <el-col :span="24" v-for="i in item.contents" :key="i.id" >
                        <el-card shadow="hover" body-style="background-color:#324155; color:#f7f7f7;">
                            {{i.title}}：{{i.content}}
                        </el-card>
                    </el-col>
                </el-row>
            </div>

            <div v-for="item in attachmentContent.filter(item => item.title ==='机构介绍')" :key="item.id">
                <p class="en_title" >机构简介</p>
                <p class="en_detail" v-for="i in item.contents" :key="i.id">
                    {{i.content}}
                </p>
            </div>
            <div style="margin-bottom: 30px" v-for="item in attachmentContent.filter(item => item.title ==='服务宗旨')" :key="item.id">
                <p class="en_title">服务宗旨</p>
                <div class="en_multi_detail" v-for="i in item.contents" :key="i.id">
                    {{i.content}}
                </div><!--客服人员-->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "organization",
        props: {
            attachmentContent: {
                type: Array,
                default: []
            }
        },
        methods:{
            open() {
                console.log("打开");
            },
            close(){
                this.$emit("close_content");
            }
        }
    };
</script>

<style lang="less">
    .carousel-image{width: 100%; position:absolute; left:50%; top:50%; transform: translate(-50%,-50%);}
    .organization_div {
        width: 100%;
        height: 100%;
        margin: auto;
        background-color: rgba(245,245,245,1);
        overflow-y: scroll;
        pointer-events:auto;
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
    .content{
        padding: 10px 30px;
        width: 80%;
    //height:100%;
        max-width: 800px;
        margin: auto;
        background-color: rgba(255,255,255,1);
    }
    .carousel_div{
        margin-top: 60px;
    }
    .en_title{
        font-size: 16px; font-weight: bold; padding: 10px 0px; margin: 10px 0px;
    }
    .en_detail{
        font-size: 14px;
        line-height: 28px;
        text-indent: 20px;
        //white-space: pre-line;
    }
        .en_multi_detail{
            font-size: 14px;
            line-height: 28px;
            text-indent: 20px;
            //white-space: pre-line;
        }
    .el-row {
        margin-bottom: 20px;
    &:last-child {
         margin-bottom: 0;
     }
    }
    .el-col {
        border-radius: 4px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .image-mask{
        width: 100%;
        height: 0;
        padding-bottom:60%;
        overflow: hidden;
        vertical-align:middle;
        position:relative;
    .image {
        position: absolute;
        width: 100%;
        display: block;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
    }
    }
    .name-span{
        display: block;
        height: 30px;
        vertical-align:middle;
        font-size: 14px;
        font-weight: bold;
        padding-top: 10px;
        padding-left: 5px;
    }
    .intro-bnt-div{
        margin-bottom: 5px;
        text-align: right;
    }
    }
</style>