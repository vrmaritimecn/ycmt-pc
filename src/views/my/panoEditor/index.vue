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
                    <attachment v-if="mainSite.isOpenAttachment" :attachmentContent="attachmentContent" @close_content="close_content"></attachment>
                </div>
            </div>
        </div>
        <!--div class="p_editor_container" :style="{ paddingRight: isShowToobar ? '46px' : '0px' }"-->
        <div class="p_editor_container">
            <!--div :style="{ width: isOpenedWidth.width }"-->
                <div id="p_editor" >
                    <!--div class="chat_outer_div" v-show="isOpenMessage">
                        <div class="chat_inner_div">
                            <div class="chat_main" id="_message_container" v-show="childDivStatus.chat">
                                <div  v-if="item.projectId==projectId" :class="item.userId==userId? 'chat_div_right':'chat_div_left'" v-for="item in messageList">
                                    <img class="chat_div_icon" :src="globalConfig.imagePath + item.userAvatar" width="100%" height="100%"/>
                                    <span class="chat_div_info" @click="findMessageLocation(item)">
                                        <img :src="globalConfig.imagePath + item.imageUrl" v-if="item.imageUrl"/>
                                        <p>{{item.message}}</p>
                                    </span>
                                </div>
                            </div>
                            <div class="scene_content" v-if="childDivStatus.thumb">
                                <span v-for="item in sceneList" @click="gotoScene(item)">{{item.name}}</span>
                            </div>
                            <div class="guide_content" v-if="childDivStatus.guide">
                                <div class="guide_item" v-for="(item,index) in guideContent" :key="item.id">
                                    <img class="guide_item_icon" src="./images/icon_rob.png" @click="controlAutoGuide(index,'all')"/>
                                     <span class="guide_item_info" @click="controlAutoGuide(index,'single')">
                                        <p>{{item.title}}</p>
                                    </span>
                                </div>
                            </div>
                            <div class="chat_footer">
                                <input  v-model="messageItem.message" @click="setChildDivStatus('chat')" :style="{width: inputActive? '4rem' : '1rem'}" ></input>
                                <img src="./images/icon_sent.png" @click="sendMessage" v-show="inputActive"/>
                                <el-upload
                                        class="upload-demo"
                                        :action="uploadUrl"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload">
                                    <img src="./images/icon_pic.png" v-show="inputActive"/>
                                </el-upload>
                                <img src="./images/icon_ser.png" v-if="butStatus.isThumbBnt" v-show="!inputActive" @click="showThumb"/>
                                <img src="./images/icon_link.png" v-if="butStatus.isLinKBut" v-show="!inputActive" @click="showAttachment"/>
                                <img src="./images/icon_play.png" v-if="butStatus.isPlayBut" v-show="!inputActive" @click="showGuideContent"/>
                                <img src="./images/icon_pos.png" v-if="butStatus.isPosBut" v-show="!inputActive" @click="goMap"/>
                                <img src="./images/icon_share.png" v-show="!inputActive" @click="cleanMessage"/>
                                <img v-if="inputActive" src="./images/icon_pro.png"  @click="setChildDivStatus('shift')"/>
                            </div>
                        </div>
                    </div-->
                    <div class="chat_main" id="_message_container" v-show="childDivStatus.chat">
                        <div  v-if="item.projectId==projectId" :class="item.userId==userId? 'chat_div_right':'chat_div_left'" v-for="item in messageList">
                            <img class="chat_div_icon" :src="globalConfig.imagePath + item.userAvatar" width="100%" height="100%"/>
                            <span class="chat_div_info" @click="findMessageLocation(item)">
                                        <img :src="globalConfig.imagePath + item.imageUrl" v-if="item.imageUrl"/>
                                        <p>{{item.message}}</p>
                                    </span>
                        </div>
                    </div>
                    <div class="scene_content" v-if="childDivStatus.thumb">
                        <span v-for="item in sceneList" @click="gotoScene(item)">{{item.name}}</span>
                    </div>
                    <div class="guide_content" v-if="childDivStatus.guide">
                        <div class="guide_item" v-for="(item,index) in guideContent" :key="item.id">
                            <img class="guide_item_icon" src="./images/icon_rob.png" @click="controlAutoGuide(index,'all')"/>
                            <span class="guide_item_info" @click="controlAutoGuide(index,'single')">
                                        <p>{{item.title}}</p>
                                    </span>
                        </div>
                    </div>
                    <div class="chat_footer">
                        <input  v-model="messageItem.message" @click="setChildDivStatus('chat')" :style="{width: inputActive? '4rem' : '1rem'}" ></input>
                        <img src="./images/icon_sent.png" @click="sendMessage" v-show="inputActive"/>
                        <el-upload
                                class="upload-demo"
                                :action="uploadUrl"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img src="./images/icon_pic.png" v-show="inputActive"/>
                        </el-upload>
                        <img src="./images/icon_ser.png" v-if="butStatus.isThumbBnt" v-show="!inputActive" @click="showThumb"/>
                        <img src="./images/icon_link.png" v-if="butStatus.isLinKBut" v-show="!inputActive" @click="showAttachment"/>
                        <img src="./images/icon_play.png" v-if="butStatus.isPlayBut" v-show="!inputActive" @click="showGuideContent"/>
                        <img src="./images/icon_pos.png" v-if="butStatus.isPosBut" v-show="!inputActive" @click="goMap"/>
                        <img src="./images/icon_share.png" v-show="!inputActive" @click="cleanMessage"/>
                        <img v-if="inputActive" src="./images/icon_pro.png"  @click="setChildDivStatus('shift')"/>
                        <!--img v-if="!inputActive" src="./images/icon_contact.png"  @click="setChildDivStatus('shift')"/-->
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
import attachment from "./dialog/attachment.vue";
import Title from "@/components/common/Title";
import { mapGetters } from "vuex";
import SockJS from  'sockjs-client';
import Stomp from 'stompjs';
import { hotspot, hotspotContent, scene, projectDetail, user } from "@/model/api";

var k = null;

function krpano_onready_callback (krpano_interface) {
    k = krpano_interface;
}

export default {
    data() {
        return {
            address:"",
            originalSceneCode:"",
            inputActive:false,
            isShow: false,
            isOpenMessage : true,
            //isOpenSceneThumb: false,
            stompClient:'',
            timer:'',
            text:"",
            isSend:false,
            projectData:{},
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
                isOpenInspection:false,
                isOpenAttachment:false
            },
            childDivStatus:{
                chat: false,
                message : true,
                thumb: false,
                map:false,
                guide:false
            },
            butStatus:{
                isThumbBnt:true,
                isLinKBut:true,
                isPlayBut:true,
                isPosBut:true,
            },
            guideContent:[],
            hotspotContent:[],
            attachmentContent:[],
            sceneAllList:[],
            sceneList:[],
            userData:{},
            userId:"",
            autoGuideStatus:false
        };
    },

    components: {
        Title,
        Toolbar,
        company,
        organization,
        technology,
        english,
        archives,
        inspection,
        attachment
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
        messageList(){
            return this.$store.getters.getMessageList
        },
        ...mapGetters([
            "getIsOpenMessage",
            "getProjectData",
            "getMessageList",
            "getIsOpenOrg",
        ])
    },
    watch:{
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
        getUserDetail() {
            this.$nextTick(() => {
                user(
                    {
                        type: "get"
                    },
                    "/personal"
                ).then(res => {
                    if (res.suceeded) {
                        this.$store.commit({
                            type: "SET_USERBLOCKLIST_INFO",
                            plylaod: res.data.blocks
                        });
                        this.$store.commit("SET_USERID", res.data.id);
                        this.$store.commit("SET_USERDATA", res.data);
                        this.userData = res.data;
                        this.userId = res.data.id;
                    }
                });
            });
        },
        getProject() {
            const projectId = this.$route.params.projectId;
            this.$nextTick(() => {
                projectDetail(
                    {
                        type: "get"
                    },
                    projectId
                ).then(res => {
                    if (res.suceeded) {
                        this.projectData = res.data;
                        this.projectId=res.data.id;
                        this.projectName=res.data.name;
                        this.initModule(res.data)
                        this.initSceneAllList();
                        //this.initWebSocket();
                        this.$store.commit("SET_PROJECT_DATA", res.data);
                    }
                });
            });
        },
        initSceneAllList(){
            this.sceneList=this.$store.getters.getSceneList;
            scene(
                {
                    type: "GET",
                    data:{
                        blockId: this.projectData.blockId,
                        page:1,
                        size:1000
                    }
                },
            ).then(res => {
                if (res.suceeded) {
                    console.log(this.sceneAllList)
                    this.sceneAllList = res.data.content;
                    this.initPano();
                }
            });
            console.log(this.sceneAllList)
        },
        initPano() {
            const projectId = this.$route.params.projectId;
            this.$store.commit("SETPROJECTID",projectId);
            this.$nextTick(() => {
                embedpano({
                    id:"kr",
                    swf: "/pano/tour.swf",
                    xml: `/pano/enter.xml?${new Date().getTime()}`,
                    target: "p_editor",
                    html5: "prefer",
                    mobilescale: 1.0,
                    passQueryParameters: true,
                    onready: krpano_onready_callback
                });
                this._ycmt_buildProject();
            });
        },
        async _ycmt_buildProject() {
            console.log("_ycmt_buildProject");
            console.log(this.sceneList);
            console.log(this.sceneAllList);
            if(this.sceneList.length>0) {
                this.address="loadpanoscene('%FIRSTXML%/xmls/block_id_"+ this.projectData.blockPanoPath +"/panos.xml',scene_"+ this.sceneList[0].code +",null, MERGE, BLEND(2));"
            }else{
                this.address="loadpanoscene('%FIRSTXML%/xmls/block_id_"+ this.projectData.blockPanoPath +"/panos.xml',scene_"+ this.sceneAllList[0].code +",null, MERGE, BLEND(2));"
            }
            k.call(this.address);
        },
        initModule(data){
            if(this.projectData.status<3){
                this.ToolbarStatus=true
            }
            else{
                this.ToolbarStatus=false
            }
            if(data.moduleName=="船商在线"){
                this.contentTitle="云船码头企业微官网"
                this.attachmentContent=[];
                this.attachmentContent=data.attachments;
                console.log("moduleName")
                console.log(this.attachmentContent)
                this.isShowContent=true
                this.mainSite.isOpenCompany=true
                this.mainSite.isOpenOrganization=false
                this.mainSite.isOpenTechnology=false
                this.mainSite.isOpenEnglish=false
                this.mainSite.isOpenArchives=false
                this.mainSite.isOpenInspection=false
                this.contentLock=true
                this.butStatus.isThumbBnt=false
                this.butStatus.isLinKBut=false;
                this.butStatus.isPlayBut=false;
                this.butStatus.isPosBut=false;
            }
            if(data.moduleName=="机构直通车"){
                this.contentTitle="云船码头海事机构直通车"
                this.attachmentContent=[];
                this.attachmentContent=data.attachments;
                this.isShowContent=true
                this.mainSite.isOpenCompany=false
                this.mainSite.isOpenOrganization=true
                this.mainSite.isOpenTechnology=false
                this.mainSite.isOpenEnglish=false
                this.mainSite.isOpenArchives=false
                this.mainSite.isOpenInspection=false

                this.contentLock=true
                this.butStatus.isThumbBnt=false
                this.butStatus.isLinKBut=false;
                this.butStatus.isPlayBut=false;
                this.butStatus.isPosBut=false;
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

                this.butStatus.isThumbBnt=true
                this.butStatus.isLinKBut= this.projectData.attachments.length>0? true : false;
                this.butStatus.isPlayBut= this.projectData.guidances.length>0? true : false;
                this.butStatus.isPosBut=true;
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
                this.butStatus.isThumbBnt=true
                this.butStatus.isLinKBut= this.projectData.attachments.length>0? true : false;
                this.butStatus.isPlayBut= this.projectData.guidances.length>0? true : false;
                this.butStatus.isPosBut=true;
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
                this.butStatus.isThumbBnt=true
                this.butStatus.isLinKBut= this.projectData.attachments.length>0? true : false;
                this.butStatus.isPlayBut= this.projectData.guidances.length>0? true : false;
                this.butStatus.isPosBut=true;
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
                this.butStatus.isThumbBnt=true
                this.butStatus.isLinKBut= this.projectData.attachments.length>0? true : false;
                this.butStatus.isPlayBut= this.projectData.guidances.length>0? true : false;
                this.butStatus.isPosBut=true;
            }
        },
        close_content(){
            this.isShowContent=false;
            this.mainSite.isOpenAttachment=false;
            this.attachmentContent=[];
        },
        initWebSocket(){
            this.connection();
            let that= this;
            this.timer = setInterval(() => {
                try {
                    that.stompClient.send("/wss/ws/sendLocation",{"code":"123"} ,"test");
                } catch (err) {
                    console.log("断线了: " + err);
                    that.connection();
                }
            }, 5000)
        },
        connection() {
            console.log("建立联线");
            let socket = new SockJS("/wss/panopipe");
            this.stompClient = Stomp.over(socket);
            let headers = {"code":"123"}
            this.stompClient.connect({"code":"123"},() => {
                this.stompClient.subscribe('/wss/user/client/getLocation', (msg) => { // 订阅服务端提供的某个topic
                    console.log('广播成功')
                    console.log(msg);  // msg.body存放的是服务端发送给我们的信息
                    this.addMessage(JSON.parse(msg.body))
                },{"code":"123"});
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
                this.messageItem.sceneCode=k.get("xml.scene")
                this.messageItem.locationFov=k.get("view.fov");
                this.messageItem.locationX=k.get("view.hlookat");
                this.messageItem.locationY=k.get("view.vlookat");
                this.messageItem.sceneId=this.sceneId;
                this.messageItem.message=this.messageItem.message;
                this.messageItem.projectId =this.$route.params.projectId;
                this.messageItem.userId =this.userId;
                this.messageItem.userAvatar =this.userData.avatar;
                this.messageItem.imageUrl =this.messageItem.imageUrl;
                this.stompClient.send("/wss/ws/sendLocation", {"code":"123"} , JSON.stringify(this.messageItem));
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
            //var k = document.getElementById("kr");
            var sN = item.sceneCode;
            console.log(sN)
            if (sN == k.get("xml.scene")) {
                console.log("相同")
                k.call("lookto(" + item.locationX + "," + item.locationY + ");");
            } else {
                k.call("loadscene(" + sN + ",view.hlookat=" + item.locationX + "&view.vlookat=" + item.locationY + "&view.fov=90,MERGE,BLEND(0.5)");
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
        gotoScene(data){
            console.log(data);
            this.sceneId=data.id
            k.call("loadpanoscene('%FIRSTXML%/xmls/block_id_"+ this.projectData.blockPanoPath +"/panos.xml',scene_"+ data.code +");");
            console.log("loadpanoscene('%FIRSTXML%/xmls/block_id_"+ this.projectData.blockPanoPath +"/panos.xml',scene_"+ data.code +");");
        },
        getSceneId(){

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
            //var k = document.getElementById("kr");
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
                    var data=this.projectData;
                    if(data.moduleName=="技术热点"){
                        this.contentTitle="云船码头技术热点解读"
                        this.mainSite.isOpenTechnology=true
                    }
                    if(data.moduleName=="航运英语"){
                        this.contentTitle="云船码头航运英语大家学"
                        this.mainSite.isOpenEnglish=true
                    }
                    if(data.moduleName=="船东宝"){
                        this.contentTitle="云船码头船舶档案卡"
                        this.mainSite.isOpenArchives=true
                    }
                    if(data.moduleName=="远程检查"){
                        this.contentTitle="云船码头项目检验卡"
                        this.mainSite.isOpenInspection=true
                    }
                    this.mainSite.isOpenAttachment=false;
                    this.loading = false;
                } else {
                    this.loading = false;
                }
            });
        },
        showAttachment(){
            //var pData=this.$store.state.message.projectData;
            this.attachmentContent=this.projectData.attachments;
            this.isShowContent=true;
            this.mainSite.isOpenAttachment=true;
            this.mainSite.isOpenTechnology=false
            this.mainSite.isOpenEnglish=false
            this.mainSite.isOpenArchives=false
            this.mainSite.isOpenInspection=false
            /*
            this.mainSite.isOpenCompany=false
            this.mainSite.isOpenOrganization=false
            this.mainSite.isOpenTechnology=false
            this.mainSite.isOpenEnglish=false
            this.mainSite.isOpenArchives=false
            this.mainSite.isOpenInspection=false
            if(this.projectData.moduleName=="船商在线"){
                this.mainSite.isOpenCompany=true
                this.mainSite.isOpenOrganization=false
                this.mainSite.isOpenAttachment=false
            }
            if(this.projectData.moduleName=="机构直通车"){
                this.mainSite.isOpenCompany=false
                this.mainSite.isOpenOrganization=true
                this.mainSite.isOpenAttachment=false
            }else{
                this.mainSite.isOpenCompany=false
                this.mainSite.isOpenOrganization=false
                this.mainSite.isOpenAttachment=true
            }

             */
        },
        showGuideContent(){
            if(this.childDivStatus.guide){
                this.setChildDivStatus('none');
            }else
            {
                this.setChildDivStatus('guide');
                this.guideContent=this.projectData.guidances
                console.log(this.guideContent);
            }
        },
        showThumb(){
            if(this.childDivStatus.thumb){
                this.setChildDivStatus('none');
            }else{
                this.setChildDivStatus('thumb');
                this.sceneList=this.$store.state.messageStore.sceneList
                console.log(this.sceneList)
            }

        },
        goMap(){
            this.setChildDivStatus('none')
            var sceneList=this.sceneAllList;
            // var k = document.getElementById("kr");
            var code=k.get("xml.scene")
            for(var i=0; i<sceneList.length; i++){
                var tCode="scene_"+sceneList[i]["code"];
                if(tCode==code) {
                    this.originalSceneId=sceneList[i]["id"];
                    var address="loadpanoscene('%FIRSTXML%/xmls/block_id_"+ this.projectData.blockPanoPath +"/panos.xml',scene_"+ sceneList[i]["imageUrl"] +",null, MERGE, BLEND(0.5));"
                    address=address+"lookto("+sceneList[i].locationX/1000+","+sceneList[i].locationY/1000+",,,true,true,js(_ycmt_renderMapPoint("+ sceneList[i]["id"] +")))；";
                    k.call(address);
                    this.isOpenMap=true;
                    this.originalSceneCode=sceneList[i]["code"]
                    return;
                }
            }
            k.call("loadscene(scene_"+ this.originalSceneCode +",null, MERGE, BLEND(1));");
        },
        renderMapPoint(val){
            console.log("renderMapPoint");
            //var k = document.getElementById("kr");
            var kstr = "";
            var hotspotList=this.sceneAllList;
            for (var i = 0; i < hotspotList.length; i++) {
                var code = hotspotList[i]["code"];
                var h0H ="hotspot" + hotspotList[i]["code"];
                var h0B ="hLayer" + hotspotList[i]["code"] + "0B";
                var h0T ="hLayer" + hotspotList[i]["code"] + "0T";
                var hH = hotspotList[i]["locationX"]/1000;
                var hV = hotspotList[i]["locationY"]/1000;

                kstr=kstr + "addhotspot("+ h0H +");";
                kstr=kstr + "set(hotspot["+ h0H +"].ath,"+ hH +");";
                kstr=kstr + "set(hotspot["+ h0H +"].atv,"+ hV +");";
                kstr=kstr + "set(hotspot["+ h0H +"].keep, false);";
                kstr=kstr + "set(hotspot["+ h0H +"].visible,true);";
                kstr=kstr + "set(hotspot["+ h0H +"].type,'image');";
                kstr=kstr + "set(hotspot["+ h0H +"].width,25);";
                kstr=kstr + "set(hotspot["+ h0H +"].height,25);";
                if(val==hotspotList[i]["id"]){
                    kstr=kstr + "set(hotspot["+ h0H +"].url,'%FIRSTXML%/image/redpoint.png');";
                }
                else{
                    kstr=kstr + "set(hotspot["+ h0H +"].url,'%FIRSTXML%/image/ppoint.png');";
                }
                kstr=kstr + "set(hotspot["+ h0H +"].onclick, 'loadscene(scene_"+hotspotList[i]["code"]+",null, MERGE, BLEND(1));');";
                kstr=kstr + "set(hotspot["+ h0H +"].onhover, 'showtext("+hotspotList[i]["name"]+", ycmt)');";
            }
            k.call(kstr);
        },
        setChildDivStatus(val){
            console.log(val)
            if(val=="shift"){
                if(this.inputActive){
                    this.inputActive=false
                    this.childDivStatus.chat=false
                }else{
                    this.inputActive=true
                    this.childDivStatus.chat=true
                    this.childDivStatus.thumb=false
                    this.childDivStatus.guide=false
                }
            }
            if(val=="none"){
                this.childDivStatus.chat=false
                this.childDivStatus.thumb=false
                this.childDivStatus.guide=false
            }
            if(val=="chat"){
                this.inputActive=true
                this.childDivStatus.chat=true
                this.childDivStatus.thumb=false
                this.childDivStatus.guide=false
                this.initWebSocket();
            }
            if(val=="thumb"){
                this.inputActive=false
                this.childDivStatus.chat=false
                this.childDivStatus.thumb=true
                this.childDivStatus.guide=false
            }
            if(val=="guide"){
                this.inputActive=false
                this.childDivStatus.chat=false
                this.childDivStatus.thumb=false
                this.childDivStatus.guide=true
            }
        },
        controlAutoGuide(index, val){
            if(val=="all"){
                if(this.autoGuideStatus){
                    this.autoGuideStatus=false
                }else{
                    this.autoGuideStatus=true
                    this._ycmt_playSound(index);
                }
            }
            if(val=="single"){
                this.autoGuideStatus=false
                k.call("playsound(guideSound,'%FIRSTXML%/"+ this.guideContent[index]["contents"][1]["extra"] +"');");
                var sN ="scene_" + this.guideContent[index]["sceneCode"];
                if (sN == k.get("xml.scene")) {
                    k.call("lookto(" + this.guideContent[index]["locationX"] + "," + this.guideContent[index]["locationY"] + ");");
                } else {
                    k.call("loadscene(" + sN + ",view.hlookat=" + this.guideContent[index]["locationX"] + "&view.vlookat=" + this.guideContent[index]["locationY"] + "&view.fov=90,MERGE,BLEND(0.5)");
                }
            }
        },
        _ycmt_playSound(index){
            if(this.autoGuideStatus){
                if(index<this.guideContent.length)
                {
                    k.call("playsound(guideSound,'%FIRSTXML%/"+ this.guideContent[index]["contents"][1]["extra"] +"',false, js(_ycmt_playSound("+(parseInt(index)+1)+")) );");
                    var sN ="scene_" + this.guideContent[index]["sceneCode"];
                    if (sN == k.get("xml.scene")) {
                        k.call("lookto(" + this.guideContent[index]["locationX"] + "," + this.guideContent[index]["locationY"] + ");");
                    } else {
                        k.call("loadscene(" + sN + ",view.hlookat=" + this.guideContent[index]["locationX"] + "&view.vlookat=" + this.guideContent[index]["locationY"] + "&view.fov=90,MERGE,BLEND(0.5)");
                    }
                }
                else{
                    this.autoGuideStatus=false
                    return
                }
            }



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
        this.getProject();
        this.getUserDetail();
        window._ycmt_setSceneId = () => {
            this.getSceneId();
        };
        window._show_content=(hotspotId)=>{
            this.getHotContent(hotspotId);
        };
        window._ycmt_buildProject = () => {
            this._ycmt_buildProject();
        };
        window._ycmt_initialScene = () => {
            this._ycmt_initialScene();
        };
        window._ycmt_playSound = (index) => {
            this._ycmt_playSound(index);
        };
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
            /*
            .chat_outer_div{
                z-index:100;
                height: 70%;
                min-height: 400px;
                max-height: 600px;
                width:360px;
                position: absolute;
                bottom:15px;
                right:15px;
                text-align: center;
                border-radius: 2px;
                overflow: hidden;
                .chat_inner_div{
                    position:relative;
                    width: 100%;
                    height:100%;
                    background: #F7F7F0;
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
                        border-radius: 2px;
                        top:0px;
                        width:100%;
                        height:calc(100% - 42px);
                        background: #F7F7F7;
                        overflow-y: auto;
                        padding: 20px 0px;
                        cursor: none;
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
                                cursor: pointer;
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
                                cursor: pointer;
                                img{
                                    display: block;
                                    width: 94%;
                                    margin:auto;
                                    margin-top: 5px;
                                    margin-bottom: 5px;
                                    cursor: pointer;
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
                                cursor: pointer;
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
                                cursor: pointer;
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
                    .scene_content{
                        position:absolute;
                        border-radius: 2px;
                        top:0px;
                        width:100%;
                        height:calc(100% - 42px);
                        background: rgba(0,0,0,0.4);
                        overflow-y: auto;
                        padding: 20px 0px;
                        display: flex;
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
                    .guide_content{
                        position:absolute;
                        border-radius: 2px;
                        top:0px;
                        width:100%;
                        height:calc(100% - 42px);
                        background: rgba(0,0,0,0.4);
                        overflow-y: auto;
                        padding: 20px 0px;
                        .guide_item{
                            position: relative;
                            width: 260px;
                            margin-top: 15px;
                            margin-bottom: 15px;
                            margin-left: 85px;
                            margin-right: 15px;
                            overflow: hidden;
                            .guide_item_icon {
                                position: absolute;
                                width: 30px;
                                height: 30px;
                                border-radius: 5px;
                                right: 0px;
                                cursor: pointer;
                            }

                            .guide_item_info {
                                //position: absolute;
                                width: 180px;
                                margin-right: 40px;
                                border-radius: 0.08rem;
                                background-color: #F7F7F7;
                                text-align: left;
                                padding: 0.2rem;
                                color: #324155;
                                font-family: "PingFang SC";
                                font-size: 12px;
                                letter-spacing: 1px;
                                line-height: 20px;
                                align-content: start;
                                display: inline-block;
                                cursor: pointer;
                            }
                        }
                    }
                    .chat_footer{
                        position:absolute;
                        bottom:0px;
                        border-radius: 4px;
                        width:100%;
                        height:40px;
                        background-color: #f7f7f7;
                        padding: 8px 8px;
                        display: flex;
                        justify-content: space-between;
                        vertical-align: center;
                        cursor: pointer;
                        input{
                            background-color: #ffffff;
                            outline-style: none ;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            flex: 1;
                            width: 260px;
                            padding: 0px 5px;
                            //margin-top: 8px;
                            height: 24px;
                        }
                        img{
                            width: 16px;
                            height: 16px;
                            margin-top: 4px;
                            margin-left: 5px;
                            margin-right: 5px;
                            cursor: pointer;
                        }
                    }
                }
            }
             */

            .chat_main{
                z-index:100;
                position:absolute;
                border-radius: 2px;
                bottom:50px;
                right:10px;
                width:360px;
                height: 60%;
                min-height: 280px;
                max-height: 700px;
                background: #F7F7F7;
                overflow-y: auto;
                padding: 20px 0px;
                cursor: none;
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
                        cursor: pointer;
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
                        cursor: pointer;
                        img{
                            display: block;
                            width: 94%;
                            margin:auto;
                            margin-top: 5px;
                            margin-bottom: 5px;
                            cursor: pointer;
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
                        cursor: pointer;
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
                        cursor: pointer;
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
            .scene_content{
                z-index:100;
                position:absolute;
                border-radius: 2px;
                bottom:50px;
                right:10px;
                width:360px;
                height: 60%;
                min-height: 280px;
                max-height: 700px;
                background: rgba(0,0,0,0.4);
                overflow-y: auto;
                padding: 20px 0px;
                display: flex;
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
            .guide_content{
                z-index:100;
                position:absolute;
                border-radius: 2px;
                bottom:50px;
                right:10px;
                width:360px;
                height: 60%;
                min-height: 280px;
                max-height: 700px;
                background: rgba(0,0,0,0.4);
                overflow-y: auto;
                padding: 20px 0px;
                .guide_item{
                    position: relative;
                    width: 260px;
                    margin-top: 15px;
                    margin-bottom: 15px;
                    margin-left: 85px;
                    margin-right: 15px;
                    overflow: hidden;
                    .guide_item_icon {
                        position: absolute;
                        width: 30px;
                        height: 30px;
                        border-radius: 5px;
                        right: 0px;
                        cursor: pointer;
                    }

                    .guide_item_info {
                        //position: absolute;
                        width: 180px;
                        margin-right: 40px;
                        border-radius: 0.08rem;
                        background-color: #F7F7F7;
                        text-align: left;
                        padding: 0.2rem;
                        color: #324155;
                        font-family: "PingFang SC";
                        font-size: 12px;
                        letter-spacing: 1px;
                        line-height: 20px;
                        align-content: start;
                        display: inline-block;
                        cursor: pointer;
                    }
                }
            }
            .chat_footer{
                position:absolute;
                z-index:100;
                bottom:5px;
                right:10px;
                border-radius: 2px;
                width:360px;
                height:40px;
                background-color: #f7f7f7;
                padding: 8px 8px;
                display: flex;
                justify-content: space-between;
                vertical-align: center;
                cursor: pointer;
                input{
                    background-color: #ffffff;
                    outline-style: none ;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    flex: 1;
                    width: 260px;
                    padding: 0px 5px;
                    //margin-top: 8px;
                    height: 24px;
                }
                img{
                    width: 16px;
                    height: 16px;
                    margin-top: 4px;
                    margin-left: 5px;
                    margin-right: 5px;
                    cursor: pointer;
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
