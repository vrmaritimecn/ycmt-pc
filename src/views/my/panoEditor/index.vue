<template>
    <div class="message_container">
        <div class="message_info"  v-if="isShowContent" :style="{ width: contentLock ? '500px' : '367px' }">
            <div class="title-box">
                <div class="title">
                    <span>{{contentTitle}}</span>
                </div>
                <div>
                    <img v-if="!contentLock" src="./images/icon_close.png" @click="close_content"/>
                </div>
            </div>
            <div class="task_list scroll-view-wrapper">
                <div id="p_content">
                    <company v-if="mainSite.isOpenCompany" :attachmentContent="attachmentContent" @close_content="close_content"></company>
                    <organization v-if="mainSite.isOpenOrganization" :attachmentContent="attachmentContent" @close_content="close_content"></organization>
                    <technology v-if="mainSite.isOpenTechnology" :hotspotContent="hotspotContent" @close_content="close_content"></technology>
                    <english v-if="mainSite.isOpenEnglish" :hotspotContent="hotspotContent" @close_content="close_content"></english>
                    <archives v-if="mainSite.isOpenArchives" :hotspotContent="hotspotContent" @close_content="close_content"></archives>
                    <inspection v-if="mainSite.isOpenInspection" :hotspotContent="hotspotContent" @close_content="close_content"></inspection>
                </div>
            </div>
        </div>
        <!--div class="p_editor_container" :style="{ paddingRight: isShowToobar ? '46px' : '0px' }"-->
        <div class="p_editor_container">
            <!--div :style="{ width: isOpenedWidth.width }"-->
                <div id="p_editor" >
                    <div class="chat_outer_div" v-show="isOpenMessage">
                        <div class="chat_inner_div">
                            <div class="chat_header" @click="closeMessage">您正在对“{{projectName}}”开展讨论</div>
                            <div class="chat_main" id="_message_container">
                                <div  v-if="item.projectId==projectId" :class="item.userId==userId? 'chat_div_right':'chat_div_left'" v-for="item in messageList">
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
                    <div class="scene_content" v-show="isOpenSceneThumb">
                        <span v-for="item in sceneAllList" @click="gotoScene(item)">{{item.name}}</span>
                    </div>
                </div>
        </div>
        <Toolbar v-if="ToolbarStatus"></Toolbar>
    </div>

</template>

<script>
import Toolbar from "@/components/Toolbar";
import company from "./dialog/company.vue";
import organization from "./dialog/organization.vue";
import technology from "./dialog/technology.vue";
import archives from "./dialog/archives.vue";
import english from "./dialog/english.vue";
import inspection from "./dialog/inspection.vue";
import Title from "@/components/common/Title";
import { mapGetters } from "vuex";
import SockJS from  'sockjs-client';
import Stomp from 'stompjs';
import { hotspot, hotspotContent, scene ,upload} from "@/model/api";
import utils from "@/widget/utils";

export default {
    data() {
        return {
            isOpenMessage : false,
            //isOpenSceneThumb: false,
            stompClient:'',
            timer:'',
            text:"",
            isSend:false,
            projectId:"",
            projectName:"",
            projectModuleName:"",
            ToolbarStatus:false,
            contentTitle:"",
            contentLock:false,
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
            messageDetail:{},
            isShowContent:false,
            mainSite:{
                isOpenCompany:false,
                isOpenOrganization:false,
                isOpenTechnology:false,
                isOpenEnglish:false,
                isOpenArchives:false,
                isOpenInspection:false
            },
            hotspotContent:[],
            attachmentContent:[],
            sceneAllList:[]
        };
    },

    components: {
        Title,
        Toolbar,
        //SceneList,
        //GuideList,
        company,
        organization,
        technology,
        english,
        archives,
        inspection
    },
    computed: {
        isOpenOrg:function(){
          return  this.$store.getters.getIsOpenOrg;
        },
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
                        ? this.isOpenGuideScene
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
        isOpenSceneThumb:function(){
            return this.$store.getters.getIsOpenSceneThumb
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
            "getIsOpenOrg"
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
            var pData=this.$store.state.messageStore.projectData;
            console.log(pData);
            this.projectName=pData.name;
            this.projectId=pData.id;
            this.attachmentContent=pData.attachments;
        },
        getMessageList:function() {
            this.$nextTick(() => {
                var container = this.$el.querySelector("#_message_container");
                console.log(container);
                container.scrollTop = container.scrollHeight;
            })
        },
        getIsOpenOrg:function() {
            console.log("getIsOpenOrg已经改变")
            this.mainSite.isOpenOrganization=this.$store.getters.getIsOpenOrg
        }
    },
    methods: {
        initModule(data){
            if(data.moduleName=="船商在线"){
                this.contentTitle="云船码头企业微官网"
                var pData=this.$store.getters.getProjectData;
                this.attachmentContent=[];
                this.attachmentContent=data.attachments;
                this.isShowContent=true
                this.mainSite.isOpenCompany=true
                this.mainSite.isOpenOrganization=false
                this.mainSite.isOpenTechnology=false
                this.mainSite.isOpenEnglish=false
                this.mainSite.isOpenArchives=false
                this.mainSite.isOpenInspection=false
                var pData=this.$store.state.messageStore.projectData
                if(pData.status<3){
                    this.ToolbarStatus=true
                }
                else{
                    this.ToolbarStatus=false
                }
                this.contentLock=true
            }
            if(data.moduleName=="机构直通车"){
                this.contentTitle="云船码头海事机构直通车"
                var pData=this.$store.getters.getProjectData;
                this.attachmentContent=[];
                this.attachmentContent=data.attachments;
                this.isShowContent=true
                this.mainSite.isOpenCompany=false
                this.mainSite.isOpenOrganization=true
                this.mainSite.isOpenTechnology=false
                this.mainSite.isOpenEnglish=false
                this.mainSite.isOpenArchives=false
                this.mainSite.isOpenInspection=false
                if(pData.status<3){
                    this.ToolbarStatus=true
                }
                else{
                    this.ToolbarStatus=false
                }
                this.contentLock=true

            }
            if(data.moduleName=="技术热点"){
                this.contentTitle="云船码头技术热点解读"
                this.mainSite.isOpenCompany=false
                this.mainSite.isOpenOrganization=false
                this.mainSite.isOpenTechnology=true
                this.mainSite.isOpenEnglish=false
                this.mainSite.isOpenArchives=false
                this.mainSite.isOpenInspection=false
                this.ToolbarStatus=true
                this.contentLock=false
            }
            if(data.moduleName=="航运英语"){
                this.contentTitle="云船码头航运英语大家学"
                this.mainSite.isOpenCompany=false
                this.mainSite.isOpenOrganization=false
                this.mainSite.isOpenTechnology=false
                this.mainSite.isOpenEnglish=true
                this.mainSite.isOpenArchives=false
                this.mainSite.isOpenInspection=false
                this.ToolbarStatus=true
                this.contentLock=false
            }
            if(data.moduleName=="船东宝"){
                this.contentTitle="云船码头船舶档案卡"
                this.mainSite.isOpenCompany=false
                this.mainSite.isOpenOrganization=false
                this.mainSite.isOpenTechnology=false
                this.mainSite.isOpenEnglish=false
                this.mainSite.isOpenArchives=true
                this.mainSite.isOpenInspection=false
                this.ToolbarStatus=true
                this.contentLock=false
            }
            if(data.moduleName=="远程检查"){
                this.contentTitle="云船码头项目检验卡"
                this.mainSite.isOpenCompany=false
                this.mainSite.isOpenOrganization=false
                this.mainSite.isOpenTechnology=false
                this.mainSite.isOpenEnglish=false
                this.mainSite.isOpenArchives=false
                this.mainSite.isOpenInspection=true
                this.ToolbarStatus=true
                this.contentLock=false
            }
        },
        initPano(a1,a2,a3) {
            const projectId = this.$route.params.projectId;
            this.$store.commit("SETPROJECTID",projectId);
            this.$nextTick(() => {
                embedpano({
                    id: "kr",
                    swf: "/pano/tour.swf",
                    xml: "/pano/enter.xml",
                    target: "p_editor",
                    html5: "prefer",
                    mobilescale: 1.0,
                    passQueryParameters: true,
                    onready: buildProject(a1,a2,a3)
                });
            });
        },
        close_content(){
          this.isShowContent=false;
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
        toggleSceneThumb(){
            this.isOpenSceneThumb=!this.isOpenSceneThumb;
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
        initSceneAllList(){
            console.log("___scene")
            console.log("___scene")
            var pData=this.$store.getters.getProjectData;
            var sList=this.$store.getters.getSceneList;
            console.log(pData);
            console.log(sList);
            this.projectName=pData.name;
            this.projectId=pData.id;
            scene(
                {
                    type: "GET",
                    data:{
                        blockId: pData.blockId,
                        page:1,
                        size:1000
                    }
                },
            ).then(res => {
                if (res.suceeded) {
                    this.sceneAllList=res.data.content;
                    this.$store.commit("SET_SCENEALLLIST",res.data.content);
                    this.initPano(pData,sList,this.sceneAllList);
                    this.initModule(pData);
                }
            });
        },
        gotoScene(data){
            console.log(data);
            var k = document.getElementById("kr");
            var pData=this.$store.getters.getProjectData;
            k.call("loadpanoscene('%FIRSTXML%/xmls/block_id_"+ pData.blockPanoPath +"/panos.xml',scene_"+ data.code +");");
            console.log("loadpanoscene('%FIRSTXML%/xmls/block_id_"+ pData.blockPanoPath +"/panos.xml',scene_"+ data.code +");");
        },
        getSceneId(){
            var k = document.getElementById("kr");
            var code=k.get("xml.scene")
            for(var i=0; i<this.sceneAllList.length; i++){
                var tCode="scene_"+this.sceneAllList[i]["code"];
                if(tCode==code) {
                    console.log(code);
                    this.reLoadScene(this.sceneAllList[i]["id"]);
                    this.$store.commit("SETSCENEID",this.sceneAllList[i]["id"])
                    return;
                }
            }
        },
        reLoadScene(id) {
            //const getScenePara = window.getScenePara && window.getScenePara();
            var sId=id;
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
                var hH = hotspotList[i]["locationX"];
                var hV = hotspotList[i]["locationY"];

                kstr=kstr + "addhotspot("+ h0H +");";
                kstr=kstr + "hotspot["+ h0H +"].loadstyle(hotspotTarget);";
                kstr=kstr + "set(hotspot["+ h0H +"].ath,"+ hH +");";
                kstr=kstr + "set(hotspot["+ h0H +"].atv,"+ hV +");";
                kstr=kstr + "set(hotspot["+ h0H +"].onclick, 'switch(layer["+ h0B +"].visible);');";

                kstr=kstr + "addlayer("+ h0B +");";
                kstr=kstr + "set(layer["+ h0B +"].parent,hotspot["+ h0H +"]);";
                kstr=kstr + "layer["+ h0B +"].loadstyle(hotspotLine);";

                kstr=kstr + "addlayer("+ h0T +");";
                kstr=kstr + "set(layer["+ h0T +"].html,'"+ hotspotList[i]["title"] +"');";
                kstr=kstr + "set(layer["+ h0T +"].parent,layer["+ h0B +"]);";
                kstr=kstr + "layer["+ h0T +"].loadstyle(hotspotText);";
                kstr=kstr + "set(layer["+ h0T +"].onclick,js(_show_content("+ hotspotList[i]["id"]+")));";
            }
            k.call(kstr);
        },
        getHotContent(val){
            const projectId = this.$route.params.projectId;
            this.loading = true;
            hotspotContent(
                {
                    type: "get",
                    data: {
                        hotspotId: val,
                        size: 1000,
                        page: 1
                    }
                },
                "all"
            ).then(res => {
                if (res.suceeded) {
                    this.hotspotContent = res.data || [];
                    this.isShowContent = true;
                    console.log(this.hotspotContent);
                    this.loading = false;
                } else {
                    this.loading = false;
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
        this.$store.commit("RESETSCENETHUMB");
        this.initSceneAllList();
        this.initWebSocket();
        window._ycmt_setSceneId = () => {
            this.getSceneId();
        };
        window._ycmt_mainContent = () => {

        };
        window._show_content=(hotspotId)=>{
            this.getHotContent(hotspotId);
        };
        this.$store.commit("ISOPENORG");
    }
}
</script>

<style lang="less">
    .message_container {
        display: flex;
        height: 100%;
        overflow: hidden;
        .message_info {
            width: 367px;
            padding-bottom: 5px;
            background-color: #fff;
            .task_list {
                overflow-y: scroll;
                height: calc(100% - 45px);
                position: relative;
                padding-right: 4px;
                background-color: #ffffff;

                &::-webkit-scrollbar {
                    width: 4px;
                    padding-bottom: 10px;
                }
            }

            #p_content {
                width: 100%;
                height:100%;
                left:0px;
                top:0px;
                z-index:11;
                transition: width 300ms;
                position: absolute;
                pointer-events: none;
            }

            .message_right {
                flex: 1;
                background: #fff;
                margin-left: 15px;
            }
        }
        .p_editor_container {
            /*
            height: 100%;
            display: flex;
            position: relative;
            padding-right: 46px;

             */
            flex: 1;
            height: 100%;
            background-size: 100%;
            margin-left: 8px;
            cursor: move;
            position: relative;
            #p_editor {

                width: 100%;
                height: 100%;
                margin-right: 8px;
                transition: width 300ms;
                position: relative;
            }
            .scene_content{
                width: 100%;
                height:100px;
                bottom:0px;
                z-index:12;
                background-color: #ffffff;
                //margin-right: 6px;
                position: absolute;
                padding: 10px;
                overflow-y: scroll;
                span{
                    display: inline-block;
                    height: 24px;
                    line-height: 24px;
                    //width: 80px;
                    padding: 5px 8px;
                    border-radius: 2px;
                    background-color: #324155;
                    margin: 5px 10px;
                    color: #FFFFFF;
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
                right:15px;
                text-align: center;
                box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
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
                        background-color: #e9e9e9;
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
            .panel_sidebar {
                width: 296px;
                height: 100%;
                background: #fff;
                padding: 0 24px;
                position: absolute;
                top: 0;
                right: 46px;
                overflow-y: scroll;
                &::-webkit-scrollbar {
                    width: 4px;
                }
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

        .title-box {
            height: 55px;
            background: #fff;
            border-bottom: 1px solid rgba(245, 245, 245, 1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px;
            .title {
                span {
                    font-size: 16px;
                    font-family: MicrosoftYaHei;
                    color: rgba(0, 0, 0, 1);
                    line-height: 24px;
                    -webkit-background-clip: text;
                }
            }
            img{
                width:18px;
                height:18px;
            }
        }
    }


</style>
