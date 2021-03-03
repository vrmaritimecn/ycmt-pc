<template>
    <div class="compamy_div" @touchstart="" @touchend="">
        <div class="content">
            <!--div class="title">
                <span>云船码头企业微官网</span>
                <img src="../images/icon_en.png"  @click="close"/>
                <img src="../images/icon_pro.png"/>
                <img src="../images/icon_ser.png"/>
                <img src="../images/icon_link.png"/>
                <img src="../images/icon_contact.png"/>
                <img src="../images/icon_pano.png" @click="close"/>
            </div-->
            <div class="carousel_div">
                <el-carousel :interval="4000" arrow="always" height="200px" v-for="item in attachmentContent.filter(item => item.title ==='轮播图')" :key="item.id">
                    <el-carousel-item v-for="i in item.contents" :key="i.id">
                        <img :src="globalConfig.imagePath + i.extra" class="carousel-image">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div style="font-size: 18px; font-weight: bold; padding: 10px 0px; margin: 10px 0px;"> {{title}}</div>
            <div>
                <div style="font-size: 14px; line-height: 21px"><!--企业新闻列表-->
                    <el-row :gutter="12" v-for="item in attachmentContent.filter(item => item.title ==='官网地址')" :key="item.id">
                        <el-col :span="24" v-for="i in item.contents" :key="i.id" >
                            <el-card shadow="hover" body-style="background-color:#324155; color:#f7f7f7;">
                                官网地址：{{i.content}}
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div v-for="item in attachmentContent.filter(item => item.title ==='公司介绍')" :key="item.id">
                <p class="en_title" >企业简介</p><!--企业简介-->
                <p class="en_detail" v-for="i in item.contents" :key="i.id">{{i.content}}</p><!--企业简介内容-->
            </div>

            <div>
                <p class="en_title" >企业产品</p><!--企业产品-->
                <div>
                    <el-row :gutter="20" v-for="item in attachmentContent.filter(item => item.title ==='产品列表')" :key="item.id">
                        <el-col :span="12"  v-for="i in item.contents" :key="i.id" :body-style="{margin:'10px'}">
                            <el-card :body-style="{ padding: '0px', margin:'10px'}">
                                <div class="image-mask"><img :src="globalConfig.imagePath + i.extra" class="image"></div>
                                <div style="padding-top: 0px;">

                                    <span class="name-span">{{i.title}}</span>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div>
                <p class="en_title">企业新闻</p><!--企业新闻-->
                <div style="font-size: 14px; line-height: 21px"><!--企业新闻列表-->
                    <el-row :gutter="12" v-for="item in attachmentContent.filter(item => item.title ==='新闻资讯')" :key="item.id">
                        <el-col :span="24" v-for="i in item.contents" :key="i.id" >
                            <el-card shadow="hover" >
                                {{i.title}}
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div style="margin-bottom: 30px">
                <p class="en_title">客服信息</p>
                <p class="en_detail" v-for="item in attachmentContent.filter(item => item.title ==='客服信息')" :key="item.id">
                    {{item.contents[0].content}}
                </p><!--客服人员-->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "company",
        props: {
            attachmentContent: {
                type: Array,
                default: []
            }
        },
        data(){
            return {
                title:""
            }
        },
        methods:{
            close(){
                this.$emit("close_content");
            },
            replace(val){
                return val.replace(/↵/g,"\n");
            }
        },
        mounted() {
            var pData=this.$store.getters.getProjectData;
            this.title=pData.name;
        }
    };
</script>

<style lang="less">
    .carousel-image{width: 100%; position:absolute; left:50%; top:50%; transform: translate(-50%,-50%);}

    .compamy_div {
        width: 100%;
        height: 100%;
        margin: auto;
        background-color: rgba(255,255,255,1);
        overflow-y: scroll;
        pointer-events:auto;
        .title{
            position: absolute;
            z-index: 1000;
            height: 40px;
            background-color: #F7F7F7;
            border-radius: 2px;
            margin-top: 2px;
            margin-left: 0px;
            padding-left: 0px;
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
            }
        }

        .content{
            padding: 15px 15px;
            width: 100%;
            //height:100%;
            margin: auto;
            background-color: rgba(255,255,255,1);
        }
        .carousel_div{
            //margin-top: 60px;
        }
        .en_title{
            font-size: 16px; font-weight: bold; padding: 10px 0px; margin: 10px 0px;
        }
        .en_detail{
            font-size: 14px;
            line-height: 28px;
            text-indent: 20px;
            white-space: pre-line;
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