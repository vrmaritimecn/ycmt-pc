<template>
    <div class="english_div">
        <!--div class="title">
            <span>云船码头专业英语训练卡</span>
            <img src="../images/icon_pano.png" @click="close"/>
        </div-->
        <div class="content">
            <div class="card" v-for="item in hotspotContent.filter(item => item.type ==='AUDIO')">
                <span>{{item.title}}</span>
                <span>{{item.content}}</span>
                <span style=" width: 200px;">
                    <img src="../images/icon_play.png" @click="playSound(item.extra)">
                    <img src="../images/icon_pause.png" @click="pauseSound()"/>
                    <img src="../images/icon_follow.png" @click="followSound(item)"/>
                </span>
            </div>
            <div class="item_div"  v-for="item in hotspotContent.filter(item => item.type ==='IMAGE')">
                <p class="item_detail"><img :src="globalConfig.imagePath + item.extra"/></p>
                <p class="item_detail">{{item.content}}</p>
            </div>
        </div>
        <audio id="music" hidden></audio>
    </div>
</template>

<script>
    export default {
        name: "english",
        props: {
            hotspotContent: {
                type: Array,
                default: []
            }
        },
        data(){
            return {
                rec : null,
                wave : null,
                recBlob : null,
                recBlobArray : []
            }
        },
        methods:{
            close(){
                this.$emit("close_content");
            },
            playSound(val){
                var audio = document.getElementById('music');
                audio.src = globalConfig.imagePath + val;
                if(audio!==null) {
                    audio.play();
                }
            },
            pauseSound(){
                var audio = document.getElementById('music');
                if(audio!==null) {
                    audio.pause();
                }
            }
        }
    };
</script>

<style lang="less">
    .carousel-image{width: 100%; position:absolute; left:50%; top:50%; transform: translate(-50%,-50%);}
    .english_div {
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
        .card{
            background-color: #f4f4f4;
            border: 4px;
            padding:10px;
            margin: 15px 0px;
            span{
                font-size: 16px;
                padding:10px 10px;
                display:block;
                text-align: left;
                display: flex;
                justify-content: space-between;
                img{
                    width: 18px;
                    height:18px;
                }
            }
        }
        .carousel_div{
            margin-top: 60px;
            border-radius: 2px;
            overflow: hidden;
        }
        .en_title{
            font-size: 16px; font-weight: bold; padding: 10px 0px; margin: 10px 0px;
        }
        .en_detail{
            font-size: 14px;
            line-height: 28px;
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