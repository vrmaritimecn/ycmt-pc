<script src="../../../../../../../../船福管理/海事局/海宝安检/开发文件/dev文件夹/js/panotour.js"></script>
<template>
    <div class="panel_sidebar" v-if="drawerHotContent">
        <div class="panel_sidebar_title"><span>添加场景资源</span><i class="iconfont icontubiaoweb-24 cursor" @click="addScene"></i></div>
        <div class="panel_sidebar_content">
            <el-row>
                <el-col :span="24" style="margin: 10px 0px;" v-for="(item, index) in attachmentList" :key="index" :class="{ active: index === currentIndex }" @click="select(index)">
                    <el-card :body-style="{ padding: '0px'}">
                        <span :class="sceneIndex==item.id? 'hot_title_active':'hot_title'" @click="loadpanoscene(item)">{{item.name}}</span>
                        <span class="hot_item_div" v-show="sceneIndex==item.id">
                            <el-row >
                                <el-col :span="12" v-for="(i, cindex) in attachmentList[index].hotspots" >
                                    <el-popover placement="top" trigger="hover">
                                        <div>
                                            <i class="iconfont icontubiaoweb-26 cursor" style="margin: 0px 10px;" @click="updateHotspot(i)" ></i>
                                            <i class="iconfont icontubiaoweb-28 cursor" style="margin: 0px 10px;" @click="changeHotspotName(i)" ></i>
                                            <i class="iconfont icontubiaoweb-29 cursor" style="margin: 0px 10px;" @click="editHotspotContent(i)" ></i>
                                            <i class="iconfont icontubiaoweb-27 cursor" style="margin: 0px 10px;" @click="deleteHotspot(i)" ></i>
                                        </div>
                                        <span :class="hotspotIndex==i.id? 'hot_item_active':'hot_item'" @click="backFindHotspot(i)" slot="reference">{{i.title}}</span>
                                    </el-popover>

                                </el-col>
                            </el-row>
                        </span>
                        <span class="att_bnt_group">
                            <i class="iconfont icontubiaoweb-24 cursor" @click="addHotspot" v-show="sceneIndex==item.id" ></i>
                            <i class="iconfont icontubiaoweb-22 cursor" @click="up(attachmentList, index)" ></i>
                            <i class="iconfont icontubiaoweb-23 cursor" @click="down(attachmentList, index)" ></i>
                            <i class="iconfont icontubiaoweb-27 cursor" @click="deleteScene(item)"></i>
                        </span>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- 修改附件弹窗 -->
        <editAttachmentDialog
                :visible.sync="isOpenEditHotName"
                :data="currentItem"
                :onSuccess="() => getSceneList()"
        ></editAttachmentDialog>

        <!-- 附件弹窗 -->
        <AttachmentComponent
                :visible.sync="isOpenEditHotContent"
                :hotspotId="currentItem.id"
                dialogTitle="场景标签内容编辑"
                v-if="currentItem.id"
                :orderList="orderList"
                :engType="engType"
        ></AttachmentComponent>
    </div>
</template>

<script>

import { mapState } from "vuex";
import { mapGetters } from "vuex";
import { hotspot, hotspotDetail, projectDetail, project, scene } from "@/model/api";
import Bus from "@/components/bus/index.js";
import editAttachmentDialog from "./editScene";
import AttachmentComponent from "@/components/Attachment";

export default {
    name: "Attachment",
    data() {
        return {
            attachmentList: [], // 获取附件列表
            newArr: [], //
            currentItem: {},
            currentIndex: null,
            isUpDown: false,
            hotspotIndex:null,
            sceneIndex:null,
            sceneList:[],
            isOpenEditHotName: false,
            isOpenEditHotContent: false,
            engType: false, // 是否专业英语
            orderList: [],
            sceneAllList:this.$store.state.messageStore.sceneAllList
        };
    },
    components: {
        editAttachmentDialog,
        AttachmentComponent
    },
    computed: {
        ...mapState({
            drawerHotContent: state => state.toolbarStore.drawerHotContent
        }),
        ...mapGetters([
            "getSceneId"
        ])
    },
    watch: {
        drawerHotContent(newVal, oldVal) {
            if (newVal) {
                this.getSceneList().then(res => {
                    var k = document.getElementById("kr");
                    var code=k.get("xml.scene")
                    for(var i=0; i<this.sceneAllList.length; i++){
                        var tCode="scene_"+this.sceneAllList[i]["code"];
                        if(tCode==code) {
                            this.sceneIndex=this.sceneAllList[i]["id"];
                            return;
                        }
                    }
                });
            }
        },
        getSceneId:function() {
            this.sceneIndex=this.$store.getters.getSceneId
        }
    },
    methods: {
        async getSceneList() {
            const projectId = this.$route.params.projectId;
            // 通过任务id获取项目的有关信息
            try {
                const { suceeded, data } = await projectDetail(
                    {
                        type: "GET",
                        data: {
                            projectId,
                            type: "DEFAULT",
                            page: "1",
                            size: "1000"
                        }
                    },
                    `${projectId}/panoInfo`
                );
                if (suceeded) {
                    this.attachmentList = data;
                    this.$store.commit("SET_SCENELIST",data)
                    var k = document.getElementById("kr");
                    if(this.attachmentList.length>0){
                        for(var i=0; i<this.attachmentList.length; i++){
                            var code=k.get("xml.scene");
                            var tCode="scene_"+this.attachmentList[i]["code"];
                            if(code==tCode){
                                k.call("loadscene("+ code +",null, MERGE|KEEPVIEW, BLEND(1));");
                                return
                            }
                        }
                        k.call("loadscene(scene_"+ this.attachmentList[0]["code"] +",null, MERGE, BLEND(1));");
                    }else{
                        k.call("loadscene(scene_"+ this.sceneAllList[0]["code"] +",null, MERGE, BLEND(1));");
                    }


                }
            } catch (error) {
                console.error(error);
            }
        },
        addScene() {
            // 新增场景
            console.log("新增场景");
            console.log(this.sceneAllList);
            const getScenePara=[]
            var k = document.getElementById("kr");
            var code=k.get("xml.scene")
            var id=""
            getScenePara[0]=k.get("xml.scene");
            getScenePara[1]=k.get("view.fov");
            getScenePara[2]=k.get("view.hlookat");
            getScenePara[3]=k.get("view.vlookat");
            console.log(code);
            for(var i=0; i<this.sceneAllList.length; i++){
                var tempC="scene_"+this.sceneAllList[i]["code"];
                if(tempC==code) {
                    //this.reLoadScene();
                    //this.$store.commit("SETSCENEID",sceneAllList[i]["id"])
                    id=this.sceneAllList[i]["id"];
                }
            }
            console.log(getScenePara);
            //const sceneId = window.getScenePara && window.getScenePara()[4];
            const sceneId=id
            const isScene = this.attachmentList.find(item => sceneId === item.id);
            const sceneIds = this.attachmentList.map(item => item.id);
            sceneIds.push(sceneId);
            if (!isScene) {
                const projectId = this.$route.params.projectId;
                projectDetail(
                    {
                        type: "post",
                        data: {

                            sceneId: getScenePara[4],
                            //projectId,
                            sceneIds: [sceneId]
                        }
                    },
                    `${projectId}/scene`
                ).then(res => {
                    if (res.suceeded) {
                        this.getSceneList();
                    }
                });
            } else {
                this.$message({
                    type: "error",
                    message: "已经在场景列表中了"
                });
            }
        },
        deleteScene(val) {
            this.$confirm(`此操作仅删除${val.name}场景，场景标签将被暂时保留, 是否继续?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    const projectId = this.$route.params.projectId;
                    projectDetail(
                        { type: "delete" },
                        `${projectId}/scene/${val.id}`).then(res => {
                            if (res.suceeded) {
                            this.getSceneList();
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                        }
                    });
                })
                .catch(() => {
                    this.sceneIndex=val.id;
                    this.hotspotIndex=-1;
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        loadpanoscene(item) {
            this.sceneIndex=item.id;
            this.hotspotIndex=-1;
            var k = document.getElementById("kr");
            k.call("loadscene(scene_"+item.code+",null, MERGE, BLEND(1));");
        },
        backFindHotspot(val) {
            this.hotspotIndex=val.id
            var k = document.getElementById("kr");
            k.call("lookto("+ val.locationX +","+ val.locationY +");");
        },
        addHotspot() {
            //const getScenePara = window.getScenePara && window.getScenePara();
            const getScenePara=[]
            var k = document.getElementById("kr");
            var code=k.get("xml.scene")
            getScenePara[0]=k.get("xml.scene");
            getScenePara[1]=k.get("view.fov");
            getScenePara[2]=k.get("view.hlookat");
            getScenePara[3]=k.get("view.vlookat");
            for(var i=0; i<this.sceneAllList.length; i++){
                var tempC="scene_"+this.sceneAllList[i]["code"];
                if(tempC==code) {
                    getScenePara[4]=this.sceneAllList[i]["id"];
                }
            }
            const projectId = this.$route.params.projectId;
            const data = {
                locationFov: getScenePara[1], //场景的视角
                locationX: getScenePara[2], //获取的热点横坐标
                locationY: getScenePara[3], //获取的热点垂向坐标
                projectId, //项目ID
                sceneId: this.sceneIndex, //场景ID
                title: "新增热点标签", //热点名称
                type: "DEFAULT" //热点类型
            };
            hotspot({ type: "post", data }).then(res => {
                if (res.suceeded) {
                    const id = this.$store.state.toolbarStore.id;
                    const code = this.$store.state.toolbarStore.code;
                    console.log(this.$store.state.toolbarStore, "toolbar");
                    var k = document.getElementById("kr");
                    k.call("loadscene("+ k.get("xml.scene") +",null, MERGE|KEEPVIEW, BLEND(1));");
                    this.getSceneList();
                    //window.loadpanoscene && window.loadpanoscene(res.data.id, res.data.code);
                    this.$message({
                        type: "success",
                        message: "新增成功!"
                    });
                }
            });
        },
        deleteHotspot(val) {
            this.$confirm(`此操作将永久删 ${val.title}, 是否继续?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    hotspotDetail({ type: "delete" }, val.id).then(res => {
                        if (res.suceeded) {
                            var k = document.getElementById("kr");
                            k.call("loadscene("+ k.get("xml.scene") +",null, MERGE|KEEPVIEW, BLEND(1));");
                            this.getSceneList();
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        updateHotspot(val) {
            const id = val.id;
            const getScenePara = window.getScenePara && window.getScenePara();
            const parasm = { locationFov:getScenePara[1], locationX: getScenePara[2], locationY: getScenePara[3] };
            hotspotDetail({ type: "put", data: parasm }, id).then(res => {
                if (res.suceeded) {
                    this.getSceneList();
                    this.$message({
                        type: "success",
                        message: "更新成功!"
                    });
                }
            });
        },
        changeHotspotName(val) {
            this.currentItem = val;
            this.isOpenEditHotName = true;
        },
        editHotspotContent(val) {
            this.currentItem = {};
            this.currentItem = val;
            this.id = val.id;
            const modules = this.$route.params.modules;
            console.log(val, "data");
            if (modules && modules === "航运英语") {
                this.orderList = ["音频", "图片"];
                this.engType = true;
                this.isOpenEditHotContent = true;
            } else {
                this.orderList = ["文本", "图片", "音频", "视频"];
                this.engType = false;
                this.isOpenEditHotContent = true;
            }
        },
        select(index, data) {
            if (this.isUpDown) {
                return false;
            }
            this.loadpanoscene(data);
            this.currentIndex = index;
        },
        handleClose(done) {
            done();
            this.$store.commit("TOGGLE_DRAWER", "drawerHotContent");
        },
        delAttach(id) {
            // 删除附件
            const projectId = this.$route.params.projectId;
            project({ type: "delete" }, `${projectId}/scene/${id}`).then(res => {
                if (res.suceeded) {
                    this.getSceneList();
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                }
            });
        },
        sortAttachment() {
            const projectId = this.$route.params.projectId;
            const sceneIds = this.newArr.map(item => item.id);
            projectDetail(
                {
                    type: "post",
                    data: {
                        sceneIds,
                        projectId
                    }
                },
                `${projectId}/scene/changeSeq`
            ).then(res => {
                if (res.suceeded) {
                    this.getSceneList();
                }
            });
        },
        up(arr, index) {
            this.sceneIndex=arr[index].id;
            this.hotspotIndex=-1;
            if (arr.length > 1 && index !== 0) {
                this.newArr = this.swapItems(arr, index, index - 1);
                this.isUpDown = true;
                this.currentIndex = index - 1;
                this.sortAttachment();
                setTimeout(() => {
                    this.isUpDown = false;
                }, 0);
            }
        },
        down(arr, index) {
            this.sceneIndex=arr[index].id;
            if (arr.length > 1 && index !== arr.length - 1) {
                this.newArr = this.swapItems(arr, index, index + 1);
                this.currentIndex = index + 1;
                this.isUpDown = true;
                this.sortAttachment();
                setTimeout(() => {
                    this.isUpDown = false;
                }, 0);
            }
        },
        swapItems(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        },
        editOpenEditAttachmentName(data) {
            this.$store.commit("SETSCENELIST", { id: data.id, code: data.code });
        },
        closeDrawer() {
            this.$store.commit("TOGGLE_DRAWER", "drawerHotContent");
            if (this.$store.state.toolbarStore.openScene) {
                this.$store.commit("TOGGLE_DRAWER", "openScene");
            }
        },
        isCloseScene(code) {
            // 是否关闭场景列表
            if (code) {
                const index = this.attachmentList.findIndex(
                    item => item.id.toString() === code.toString()
                );
                if (index === -1) {
                    this.$store.commit("SETOPENSCENE");
                    // this.$store.state.toolbarStore.openScene = false;
                } else {
                    const data = this.attachmentList[index];
                    this.select(index, data);
                }
            }
        }
    },
    mounted() {
        //this.getSceneAllList();
        window._hban_addScene = () => {
            if (!this.drawerHotContent) {
                Bus.$emit("toolbar-hander", { type: "drawerHotContent", index: 3 });
            }
            this.getAttachmentList().then(res => {
                this.addScene();
            });
        };
        window.isCloseScene = this.isCloseScene;
    }
};
</script>

<style lang="less">
.panel_sidebar {
    width: 296px;
    padding: 0px 0px !important;
    position: absolute;
    height: 100%;
    overflow: hidden;
    .panel_sidebar_title{
        width: 290px !important;
        height:44px;
        position: relative;
        top:0px;
        left:4px;
        text-align: center;
        border-bottom: thin solid #d9d9d9;
        span {
            font-size: 16px;
            line-height: 44px;
            margin-right: 20px;
        }
    }
    .panel_sidebar_content{
        width: 296px !important;
        height: calc(100% - 45px);
        position: relative;
        //top:45px;
        margin-top: 1px;
        overflow-y: scroll;
        padding: 0px 15px;
        &::-webkit-scrollbar {
            width: 1px;
        }
        //text-align: center;

        /*height: 4px;*/
    }
}
.hot_title_active{
    display: block;
    text-align:center;
    font-size: 14px;
    padding:15px 5px;
    background: #324155;
    border-bottom: thin solid #e6a23c;
    color: #e6a23c;
    cursor:pointer;
}
.hot_title{
    display: block;
    text-align:center;
    font-size: 14px;
    padding:15px 5px;
    background: #324155;
    color: #F7F7F7;
    cursor:pointer;
}
.hot_item_div{
    display: block;
    text-align:center;
    font-size: 14px;
    padding:15px 5px;
    background-color: #f0f0f0;
    color: #333333;
 }
.hot_item{
    display: block;
    text-align: center;
    margin:5px 10px;
    cursor:pointer;
    border: none;
}
.hot_item_active{
    display: block;
    text-align: center;
    color: #ff6900;
    margin:5px 10px;
    cursor:pointer;
    border: none;
}
.hot_bnt_group{
    display: flex;
    margin: 10px;
    padding:0px 20px;
    justify-content: space-between
}
</style>
