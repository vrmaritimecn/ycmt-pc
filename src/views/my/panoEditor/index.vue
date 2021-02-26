<template>
    <div class="p_editor_container" :style="{ paddingRight: isShowToobar ? '46px' : '0px' }">
        <div id="p_editor" :style="{ width: isOpenedWidth.width }" ></div>
        <!--
        <div style="z-index:100; width:100%; position: absolute; top:5px; text-align: center;" visible="false"><el-button size="mini" type="warning">警告按钮</el-button></div>
        <div style="z-index:100; width:120px; position: absolute; bottom:5px; left:5px; text-align: center;" visible="false">
            <el-button style="margin:10px" size="mini" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button style="margin:10px" size="mini" type="success" icon="el-icon-check" circle></el-button>
        </div>
        <div style="z-index:100; width:50px; height: 300px; position: absolute; bottom:5px; right:50px; text-align: center;" visible="false">
            <el-button style="margin:10px" size="mini" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button style="margin:10px" size="mini" type="success" icon="el-icon-check" circle></el-button>
            <el-button style="margin:10px" size="mini" type="info" icon="el-icon-message" circle></el-button>
            <el-button style="margin:10px" size="mini" type="warning" icon="el-icon-star-off" circle></el-button>
            <el-button style="margin:10px" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            <SceneList ref="SceneList" v-if="isShowToobar"></SceneList>
            <GuideList v-if="isShowToobar"></GuideList>
        </div>
        <div style="z-index:100; position: absolute; top:5px; right:50px; text-align: center;" visible="false">
            <el-card style="margin: 10px;" shadow="always">
                总是显示
            </el-card>
        </div>
        <el-drawer  title="场景列表区" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
            <div>水平场景</div>
            <div>水平场景分类</div>
        </el-drawer>
        <el-drawer  title="地图列表区" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
            <div>地图列表</div>
        </el-drawer>
        -->
        <!-- 右侧工具条 -->

        <div class="chat_outer_div" v-show="isOpenMessage">
            <div class="chat_inner_div">
                <div class="chat_header" @click="closeMessage">您正在对“{{projectName}}”开展讨论</div>
                <div class="chat_main" id="_message_container">
                    <div :class="item.userId==userId && item.projectId==messageItem.projectId? 'chat_div_right':'chat_div_left'" v-for="item in messageList">
                        <img class="chat_div_icon" :src="globalConfig.imagePath + item.userAvatar" width="100%" height="100%"/>
                        <span class="chat_div_info" @click="findMessageLocation(item)">
                            <img :src="globalConfig.imagePath + item.imageUrl" v-if="item.imageUrl"/>
                            <p>{{item.message}}</p>
                        </span>

                    </div>
                </div>
                <div class="chat_footer">
                    <input  v-model="messageItem.message"></input>
                    <img src="./images/icon_sent.png" @click="sendMessage"/>
                    <el-upload
                            class="upload-demo"
                            :action="uploadUrl"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img src="./images/icon_pic.png"/>
                    </el-upload>
                    <img src="./images/icon_mic.png" @click="cleanMessage"/>
                </div>
            </div>
        </div>

        <Toolbar v-if="isShowToobar"></Toolbar>
    </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import SceneList from "@/components/Toolbar/Panel/Scene/sceneList";
import GuideList from "@/components/Toolbar/Panel/Guide/guideList.vue";
import { mapGetters } from "vuex";
import SockJS from  'sockjs-client';
import Stomp from 'stompjs';
import { hotspot } from "@/model/api";
import utils from "@/widget/utils";

export default {
    data() {
        return {
            isOpenMessage : false,
            stompClient:'',
            timer:'',
            text:"",
            isSend:false,
            projectId:"",
            projectName:"",
            sceneId:"",
            messageItem:{
                userId:"",
                userAvatar:"",
                projectId:this.$route.params.projectId,
                message:"",
                sceneId:"",
                sceneCode:"",
                locationX:"",
                locationY:"",
                locationFov:"",
                ImageUrl:""
            },
            messageDetail:{}
        };
    },

    components: {
        Toolbar,
        SceneList,
        GuideList
    },
    methods: {
        initPano(a1,a2) {
            const projectId = this.$route.params.projectId;
            this.$store.commit("SETPROJECTID",projectId);
            this.$nextTick(() => {
                embedpano({
                    id: "kr",
                    swf: "/pano/tour.swf",
                    xml: `/pano/${this.isShowToobar ? "enter" : "main_c"}.xml`,
                    target: "p_editor",
                    html5: "prefer",
                    mobilescale: 1.0,
                    passQueryParameters: true,
                    onready: buildProject(a1,a2)
                });
            });
        },
        initWebSocket(){
            this.connection();
            let that= this;
            // 断开重连机制,尝试发送消息,捕获异常发生时重连
            this.timer = setInterval(() => {
                try {
                    that.stompClient.send("/user/client/getLocation/0",{} ,"test");
                } catch (err) {
                    console.log("断线了: " + err);
                    that.connection();
                }
            }, 5000)
        },
        connection() {
            console.log("建立联线");
            let socket = new SockJS("/wss");
            this.stompClient = Stomp.over(socket);
            let headers = {"code":"123"}
            this.stompClient.connect(headers,() => {
                this.stompClient.subscribe('/user/client/getLocation/'+this.$route.params.projectId, (msg) => { // 订阅服务端提供的某个topic
                    console.log('广播成功')
                    console.log(msg);  // msg.body存放的是服务端发送给我们的信息
                    console.log("追加数据")
                    this.addMessage(JSON.parse(msg.body))
                },headers);
            }, (err) => {
                console.log('失败')
                console.log(err);
            });
        },    //连接 后台
        sendMessage(){
            if(this.messageItem.message=="")
            {
                this.$message({
                   type:"error",
                   message:"输入信息不能为空"
                });
            }else{
                var getScenePara = window.getScenePara && window.getScenePara();
                this.messageItem.sceneCode=getScenePara[0];
                this.messageItem.locationFov=getScenePara[1];
                this.messageItem.locationX=getScenePara[2];
                this.messageItem.locationY=getScenePara[3];
                this.messageItem.sceneId=getScenePara[4];
                this.messageItem.message=this.messageItem.message;
                this.messageItem.projectId =this.$route.params.projectId;
                this.messageItem.userId =this.$store.getters.getUserId;
                this.messageItem.userAvatar =this.$store.getters.getUserAvatar;
                this.messageItem.imageUrl =this.messageItem.imageUrl;
                console.log(this.$store.getters.getUserAvatar);
                this.stompClient.send("/user/client/getLocation/"+this.$route.params.projectId, {"code":"123"} , JSON.stringify(this.messageItem));
                this.messageItem.imageUrl ="";
                this.messageItem.message = ""
            }

        },
        addMessage(val){
            console.log(val)
           this.$store.commit("ADDMESSSAGE",val);
        },
        cleanMessage(){
            this.$store.commit("RESETMESSSAGE");
        },
        closeMessage(){
            this.$store.commit("RESETISOPENMESSAGE");
        },
        findMessageLocation(item){
            console.log(item);
            var k = document.getElementById("kr");
            var sN = "scene_" + item.sceneCode;
            if (sN == k.get("xml.scene")) {
                k.call("lookto(" + item.locationX + "," + item.locationY + ");");
            } else {
                k.call("tween(layer[sRS].alpha,1,0.2,DEFAULT,tween(layer[sRS].alpha,0);); loadscene(" + sN + ",view.hlookat=" + item.locationX + "&view.vlookat=" + item.locationY + "&view.fov=90,MERGE,BLEND(0.5));");
            }
        },
        disconnect() {
            if (this.stompClient) {
                this.stompClient.disconnect();
            }
        },
        handleAvatarSuccess(res, file) {
            console.log("tupian dizhi "+ res.data.path)
            this.messageItem.message="图片消息";
            this.messageItem.imageUrl = res.data.path;
            this.sendMessage();
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg"||"image/png";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传头像图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
        renderHotspot(val){
            console.log("renderHotspot");
            var k = document.getElementById("kr");
            var kstr = "";
            var hotspotList=val;
            for (var i = 0; i < hotspotList.length; i++) {
                var code = hotspotList[i]["code"];
                var h0H ="hotspot" + hotspotList[i]["code"];
                var h0B ="hLayer" + hotspotList[i]["code"] + "0B";
                var h0T ="hLayer" + hotspotList[i]["code"] + "0T";
                var h01 ="hLayer" + hotspotList[i]["code"] + "01";
                var h02 ="hLayer" + hotspotList[i]["code"] + "02";
                var h03 ="hLayer" + hotspotList[i]["code"] + "03";
                var h04 ="hLayer" + hotspotList[i]["code"] + "04";
                var h0C ="hLayer" + hotspotList[i]["code"] + "0C";
                var hH = hotspotList[i]["locationX"];
                var hV = hotspotList[i]["locationY"];

                kstr=kstr + "addhotspot("+ h0H +");";
                kstr=kstr + "hotspot["+ h0H +"].loadstyle(hotspotAni);";
                kstr=kstr + "set(hotspot["+ h0H +"].ath,"+ hH +");";
                kstr=kstr + "set(hotspot["+ h0H +"].atv,"+ hV +");";
                kstr=kstr + "set(hotspot["+ h0H +"].onclick, 'switch(layer["+ h0B +"].visible);');";

                kstr=kstr + "addlayer("+ h0B +");";
                kstr=kstr + "set(layer["+ h0B +"].parent,hotspot["+ h0H +"]);";
                kstr=kstr + "layer["+ h0B +"].loadstyle(hIconBg);";

                kstr=kstr + "addlayer("+ h0T +");";
                kstr=kstr + "set(layer["+ h0T +"].html,'"+ hotspotList[i]["title"] +"');";
                kstr=kstr + "set(layer["+ h0T +"].parent,layer["+ h0B +"]);";
                kstr=kstr + "layer["+ h0T +"].loadstyle(hText);";

                kstr=kstr + "addlayer("+ h01 +");";
                kstr=kstr + "set(layer["+ h01 +"].parent,layer["+ h0B +"]);";
                kstr=kstr + "layer["+ h01 +"].loadstyle(hIcon01);";

                kstr=kstr + "addlayer("+ h02 +");";
                kstr=kstr + "set(layer["+ h02 +"].parent,layer["+ h0B +"]);";
                kstr=kstr + "layer["+ h02 +"].loadstyle(hIcon02);";
                kstr=kstr + "set(layer["+ h02 +"].onclick, js(alert('1')););";

                kstr=kstr + "addlayer("+ h03 +");";
                kstr=kstr + "set(layer["+ h03 +"].parent,layer["+ h0B +"]);";
                kstr=kstr + "layer["+ h03 +"].loadstyle(hIcon03);";
                kstr=kstr + "set(layer["+ h03 +"].onclick, js(alert('1')););";

                kstr=kstr + "addlayer("+ h04 +");";
                kstr=kstr + "set(layer["+ h04 +"].parent,layer["+ h0B +"]);";
                kstr=kstr + "layer["+ h04 +"].loadstyle(hIcon04);";
                kstr=kstr + "set(layer["+ h04 +"].onclick, js(alert('1')););";

                kstr=kstr + "addlayer("+ h0C +");";
                kstr=kstr + "set(layer["+ h0C +"].parent,layer["+ h0B +"]);";
                kstr=kstr + "set(layer["+ h0C +"].onclick, js(alert('1')););";
                kstr=kstr + "layer["+ h0C +"].loadstyle(hIconBgClose);";
            }
            k.call(kstr);
        }
    },
    computed: {
        isOpenedWidth: function() {
            const data = this.$store.state.toolbarStore;
            const toolbarList = [
                "drawerAttachment",
                "drawerIntro",
                "drawerPerson",
                "drawerHotContent",
                "drawerGuideContent"
            ];
            const isOpenListValue = toolbarList.map(item => data[item]).some(item => item);

            return {
                width: `calc(100% - ${
                    isOpenListValue
                        ? this.isOpenGuideScene //this.isOpenScene || this.isOpenGuideScene
                            ? "600px"
                            : "296px"
                        : "0px"
                })`
            };
        },
        isOpenScene: function() {
            return this.$store.state.toolbarStore.openScene;
        },
        uploadUrl() {
            const url = `/api/file/upload?fileName=default&relatedId=${this.$route.params.projectId}&fileType=PROJECT_IMAGE`;
            return url;
        },
        isOpenGuideScene: function() {
            return this.$store.state.toolbarStore.openGuideScene;
        },
        isShowToobar: function() {
            // 1 我的任务过 2课件过来
            return this.$route.params.from === "1";
        },
        userId(){
            return this.$store.getters.getUserId
        },
        messageList(){
          return this.$store.getters.getMessageList
        },
        ...mapGetters([
            "getIsOpenMessage",
            "getProjectData",
            "getMessageList",
            "getSceneId"
        ])
    },
    watch:{
        getIsOpenMessage:function(){
            this.isOpenMessage=this.$store.getters.getIsOpenMessage
            console.log(this.isOpenMessage)
            if(this.isOpenMessage){
            }
            else{
                //this.disconnect();
            }
        },
        getProjectData:function() {
            var pData=this.$store.getters.getProjectData;
            console.log(pData);
            this.projectName=pData.name;
            this.projectId=pData.id;
        },
        getMessageList:function() {
            this.$nextTick(() => {
                var container = this.$el.querySelector("#_message_container");
                console.log(container);
                container.scrollTop = container.scrollHeight;
            })
        },
        getSceneId:function() {
            var sId=this.$store.getters.getSceneId
            const projectId = this.$route.params.projectId;
            this.loading = true;
            hotspot({
                type: "get",
                data: {
                    projectId,
                    sceneId: sId,
                    type: "DEFAULT",
                    page: 1,
                    size: 1000
                }
            }).then(res => {
                if (res.suceeded) {
                    this.loading = false;
                    const list = res.data.content || [];
                    this.$store.commit("SET_HOTSPOTLIST", list);
                    this.renderHotspot(list);
                }
            });
        }
    },
    beforeDestroy() {
        window.removepano && window.removepano("kr");
        this.$store.commit("SETTOGGLETOOLBR", "all");
        this.$store.commit("RESETISOPENMESSAGE");
        this.disconnect();
        clearInterval(this.timer);
    },
    mounted() {
        var pData=this.$store.getters.getProjectData;
        var sList=this.$store.getters.getSceneList;
        this.projectName=pData.name;
        this.projectId=pData.id;
        this.initPano(pData,sList);
        this.initWebSocket();
        window._ycmt_setSceneId = () => {
            console.log("_ycmt_setSceneId");
            const getScenePara = window.getScenePara && window.getScenePara();
            this.$store.commit("SETSCENEID",getScenePara[4])
        };
    }
}
</script>

<style lang="less">
.p_editor_container {
    height: 100%;
    display: flex;
    position: relative;
    padding-right: 46px;
    #p_editor {
        // flex: 1;
        z-index:10;
        margin-right: 6px;
        transition: width 300ms;
        position: relative;
    }
    .panel_sidebar {
        width: 296px;
        height: 100%;
        background: #fff;
        padding: 0 24px;
        // transform: translateX(296px);
        // display: none;
        position: absolute;
        top: 0;
        right: 46px;
        // overflow: hidden;
        overflow-y: scroll;
        &::-webkit-scrollbar {
            width: 4px;
            /*height: 4px;*/
        }
        // &::-webkit-scrollbar-thumb {
        //     border-radius: 10px;
        //     -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        //     background: rgba(0, 0, 0, 0.2);
        // }
        // &::-webkit-scrollbar-track {
        //     -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        //     border-radius: 0;
        //     background: rgba(0, 0, 0, 0.1);
        // }
        .common {
            h2 {
                font-size: 18px;
                font-family: MicrosoftYaHei;
                color: rgba(51, 51, 51, 1);
                line-height: 24px;
                padding: 10px 0;
            }
            .el-form-item {
                .el-form-item__label {
                    font-size: 16px;
                    font-family: MicrosoftYaHei;
                    color: rgba(51, 51, 51, 1);
                    line-height: 21px;
                }
            }
        }
    }
}
.chat_outer_div{
    z-index:100;
    height: 90%;
    min-height: 400px;
    max-height: 600px;
    width:360px;
    position: absolute;
    bottom:15px;
    right:65px;
    text-align: center;
//    background-color: #ff6900;
    border-radius: 5px;
    overflow: hidden;
    .chat_inner_div{
        position:relative; width: 100%; height:100%;
        .chat_header{
            position:absolute;
            top:0px;
            width:100%;
            height:40px;
            background-color: #324155;
            color:#F7F7F7;
            line-height: 40px;
        }
        .chat_main{
            position:absolute;
            top:40px;
            width:100%;
            height:calc(100% - 80px);
            background-color: #ffffff;
            overflow-y: auto;
            padding: 20px 0px;
            .chat_div_right {
                position: relative;
                width: 260px;
                margin-top: 15px;
                margin-bottom: 15px;
                margin-left: 85px;
                margin-right: 15px;
                overflow: hidden;

                .chat_div_icon {
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    border-radius: 5px;
                    right: 0px;
                    //margin-right: 10px;
                }

                .chat_div_info {
                    //position: absolute;
                    width: 180px;
                    min-width: 10px;
                    margin-right: 40px;
                    border-radius: 2px 2px 2px 2px;
                    background-color: #324155;
                    text-align: left;
                    padding: 8px;
                    color: #F7F7F7;
                    font-family: "PingFang SC";
                    font-size: 12px;
                    letter-spacing: 1px;
                    line-height: 20px;
                    align-content: start;
                    display: inline-block;
                    img{
                        display: block;
                        width: 94%;
                        margin:auto;
                        margin-top: 5px;
                        margin-bottom: 5px;
                    }
                }
            }
            .chat_div_left{
                position: relative;
                width: 260px;
                margin-top: 15px;
                margin-bottom: 15px;
                margin-left: 15px;
                margin-right: 85px;
                overflow:hidden;
                .chat_div_icon{
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    border-radius: 5px;
                    left:0px;
                    //margin-right: 10px;
                }
                .chat_div_info{
                    //position: absolute;
                    width: 180px;
                    min-width: 10px;
                    margin-left: 40px;
                    border-radius: 2px 2px 2px 2px;
                    background-color: #324155;
                    text-align: left;
                    padding: 8px;
                    color: #F7F7F7;
                    font-family: "PingFang SC";
                    font-size: 12px;
                    letter-spacing: 1px;
                    line-height: 20px;
                    align-content: start;
                    display: inline-block;
                    span{

                    }
                    img{
                        display: block;
                        width: 94%;
                        margin:auto;
                        margin-top: 5px;
                        margin-bottom: 5px;
                    }
                }
            }
        }
        .chat_footer{
            position:absolute;
            bottom:0px;
            width:100%;
            height:40px;
            background-color: #f0f0f0;
            padding: 8px 8px;
            display: flex;
            justify-content: space-between;
            vertical-align: center;
            input{
                background-color: #ffffff;
                outline-style: none ;
                border: 1px solid #ccc;
                border-radius: 4px;
                width: 260px;
                padding: 0px 5px;
                //margin-top: 8px;
                height: 24px;
            }
            img{
                width: 16px;
                height: 16px;
                margin-top: 4px;
                cursor: pointer;
            }
        }
    }

}
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    height: 500px;
}

body > .el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}
</style>
