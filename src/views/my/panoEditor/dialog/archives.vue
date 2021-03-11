<template>
    <div class="archives_div">

        <!--div class="title">
            <span>云船码头船舶组件档案卡</span>
            <img src="../images/icon_en.png"/>
            <img src="../images/icon_pro.png"/>
            <img src="../images/icon_ser.png"/>
            <img src="../images/icon_link.png"/>
            <img src="../images/icon_contact.png"/>
            <img src="../images/icon_pano.png" @click="close"/>
        </div-->
        <div class="content">
            <div class="item_div">
                <el-table size="mini" :data="hotspotContent.filter(item => item.type ==='TEXT')" border>
                    <el-table-column prop="title" label="参数名称" width="100" align="center"></el-table-column>
                    <el-table-column prop="content" label="参数详情" align="center"></el-table-column>
                </el-table>
            </div>


            <div class="item_div" v-for="item in hotspotContent.filter(item => item.type ==='IMAGE')">
                <p class="item_detail"><img :src="globalConfig.imagePath + item.extra"/></p>
                <p class="item_title">{{item.title}}</p>
                <p class="item_detail">{{item.content}}</p>
            </div>
            <div class="item_div" v-for="item in hotspotContent.filter(item => item.type ==='VIDEO')">
                <p class="item_detail">
                    <video width="100%" :src="globalConfig.imagePath + item.extra" controls="controls"/>
                </p>
                <p class="item_title">影像档案名称</p>
                <p class="item_detail">影像档案介绍</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "archives",
        props: {
            hotspotContent: {
                type: Array,
                default: []
            }
        },
        data() {
            return {

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
    .archives_div {
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
                img{
                    width: 100%;
                    border-radius: 2px;
                }
            }
        }

    }
</style>