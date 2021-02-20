<template>
    <!-- <el-drawer
        title="我是标题"
        :visible.sync="drawerGuideContent"
        :with-header="false"
        :size="296"
        :before-close="handleClose"
        :modal="false"
        :wrapperClosable="false"
    > -->
    <div class="panel_sidebar" v-if="drawerGuideContent">
        <div class="panel_sidebar_title"><span>编辑对话或独白</span><i class="iconfont icontubiaoweb-24 cursor" @click="addGuide"></i></div>
        <div class="panel_sidebar_content">
            <el-row>
                <el-col :span="24" style="margin: 10px 0px;" v-for="(item, index) in attachmentList" :key="index" :class="{ active: index === currentIndex }" @click="select(index)">
                    <el-card :body-style="{ padding: '0px'}">
                        <span class="guide_title" @click="selectGuideIndex(item.id)">{{item.title}}</span>
                        <span class="guide_item_div" v-show="guideIndex==item.id">
                            <el-row >
                                <el-col :span="12" v-for="item in sceneList">
                                    <span :class="sceneIndex==item.id? 'guide_item_active':'guide_item'" @click="loadpanoscene(item)">{{item.name}}</span>
                                </el-col>
                            </el-row>
                        </span>
                        <span class="guide_bnt_group" >
                            <i class="iconfont icontubiaoweb-26 cursor" @click="changeGuideLocation(item)" v-show="guideIndex==item.id && sceneIndex!=-1"></i>
                            <i class="iconfont icontubiaoweb-28 cursor" @click="changeGuideName(item)" ></i>
                            <i class="iconfont icontubiaoweb-29 cursor" @click="openHotspotConent(item)"></i>
                            <i class="iconfont icontubiaoweb-22 cursor" @click="up(attachmentList, index)" ></i>
                            <i class="iconfont icontubiaoweb-23 cursor" @click="down(attachmentList, index)" ></i>
                            <i class="iconfont icontubiaoweb-27 cursor" @click="handleDel(item, index)"></i>
                        </span>
                    </el-card>
                </el-col>
            </el-row>
        <!--div class="attachment common">
            <div class="title">
                <span>编辑对话或独白</span>
                <i class="iconfont icontubiaoweb-24 cursor" @click="addGuide"></i>
            </div-->
            <!--div class="attachment_list">
                <div class="header">
                    <span style="width:14%">内容</span>
                    <span style="width:170px">概要</span>
                    <span>操作</span>
                </div>
                <div class="body">
                    <div
                        class="item"
                        v-for="(item, index) in attachmentList"
                        :key="index"
                        @click="select(index)"
                        :class="{ active: index === currentIndex }"
                    >
                        <div class="link" style="width:13%">
                            <i
                                class="iconfont icontubiaoweb-29 cursor"
                                @click="openHotspotConent(item)"
                            ></i>
                        </div>
                        <div
                            class="link_name ellipsis cursor"
                            @click="editOpenEditAttachmentName(item)"
                        >
                            <el-tooltip
                                class="item"
                                effect="light"
                                :content="item.title"
                                placement="left"
                                offset="30"
                                :enterable="false"
                            >
                                <span>{{ item.title }}</span>
                            </el-tooltip>
                        </div>
                        <div class="operate">
                            <i
                                class="iconfont icontubiaoweb-21"
                                @click="handleDel(item, index)"
                            ></i>
                            <i
                                class="iconfont icontubiaoweb-22"
                                @click="up(attachmentList, index)"
                            ></i>
                            <i
                                class="iconfont icontubiaoweb-23"
                                @click="down(attachmentList, index)"
                            ></i>
                            <i class="iconfont icontubiaoweb-28" @click="edit(item, index)"></i>
                        </div>
                    </div>
                </div>
            </div-->
        </div>

        <div id="triangle-right" @click="closeDrawer"></div>

        <HotspotConent
            :visible.sync="shows.isOpenHotspotConent"
            :data="currentItem"
            :onSuccess="getGuideList"
        ></HotspotConent>

        <!-- 修改附件弹窗 -->
        <editSceneDialog
            :visible.sync="shows.isOpenEditAttachment"
            :data="currentItem"
            :onSuccess="getGuideList"
        ></editSceneDialog>
    </div>
    <!-- </el-drawer> -->
</template>

<script>
import { mapState } from "vuex";

// 批量新增弹窗
import HotspotConent from "./Dialog";
import editSceneDialog from "./editGuide";
import { hotspot, hotspotDetail, projectDetail, hotspotContentDetail } from "@/model/api";
import Bus from "@/components/bus/index.js";

export default {
    name: "Attachment",
    data() {
        return {
            shows: {
                // isOpenAttachment: false, // 附件弹窗
                isOpenHotspotConent: false, // 批量新增弹窗
                isOpenEditAttachment: false // 修改附件弹窗
            },
            attachmentList: [], // 获取附件列表
            newArr: [], //
            currentItem: {},
            currentIndex: null,
            isUpDown: false,
            guideIndex:-1,
            sceneList:[],
            sceneIndex:-1
        };
    },
    components: {
        HotspotConent,
        editSceneDialog
    },
    computed: {
        ...mapState({
            drawerGuideContent: state => state.toolbarStore.drawerGuideContent
        })
    },
    watch: {
        drawerGuideContent(newVal, oldVal) {
            if (newVal) {
                this.getGuideList().then(res => {
                    this.attachmentList.length > 0 && this.select(0);
                });
            }
        }
    },
    methods: {
        async getGuideList() {
            const projectId = this.$route.params.projectId;
            // 通过任务id获取项目的有关信息
            try {
                const { suceeded, data } = await hotspotDetail(
                    {
                        type: "GET",
                        data: {
                            projectId,
                            type: "GUIDE",
                            page: "1",
                            size: "1000"
                        }
                    },
                    "/all"
                );
                if (suceeded) {
                    this.attachmentList = data || [];
                    const currentIndex = this.currentIndex;
                    if (this.attachmentList[currentIndex]) {
                        //this.editOpenEditAttachmentName(this.attachmentList[currentIndex]);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },
        getSceneList() {
            const projectId = this.$route.params.projectId;
            // 通过任务id获取项目的有关信息
            projectDetail(
                {
                    type: "GET",
                    data: {
                        projectId,
                        page: "1",
                        size: "1000"
                    }
                },
                `${projectId}/panoInfo`
            ).then(res => {
                if (res.suceeded) {
                    this.sceneList = res.data;
                }
            });
        },
        addGuide() {
            const projectId = this.$route.params.projectId;
            // 通过任务id获取项目的有关信息
            const getScenePara = window.getScenePara && window.getScenePara();
            var isSceneRes=false;
            for(var i=0; i<this.sceneList.length; i++){
                if(this.sceneList[i]["id"]==getScenePara[4]){
                    isSceneRes=true;
                }
            }
            if(isSceneRes){
                hotspot({
                    type: "post",
                    data: {
                        projectId,
                        type: "GUIDE",
                        title: "请修改脚本介绍",
                        locationFov: getScenePara[1],//场景的视角
                        locationX: getScenePara[2], //获取的热点横坐标
                        locationY: getScenePara[3], //获取的热点垂向坐标,
                        sceneId: getScenePara[4], //场景ID
                    }
                }).then(res => {
                    if (res.suceeded) {
                        this.defualtAddContent(res.data.id);
                    }
                });
            }
            else{
                this.$message({
                    message:'目前所在场景不属于项目资源，无法添加引导内容',
                    type: 'warning'
                });
            }
        },
        defualtAddContent(val) {
            // 默认添加
            const image = {
                // 参数
                content: "upaction", // 内容
                extra: "static/app/gudiance/up.png", // 附件url
                hotspotId:val, //
                title: "引导标识", // 标题
                type: "IMAGE" // 类型
            };
            const audio = {
                // 参数
                content: "请添加语音说明", // 内容
                extra: "static/app/sound/defaultguide_001.wav", // 默认值
                hotspotId:val, //
                title: "请添加内容提示", // 标题
                type: "AUDIO" // 类型
            };
            const hotspotContentList = [image, audio];

            const params = {
                hotspotContentList
            };
            hotspotContentDetail({
                type: "post",
                data: params
            }).then(res => {
                if (res.suceeded) {
                    this.$message({
                        type: "success",
                        message: "操作成功"
                    });
                    this.getGuideList();
                }
            });
        },
        loadpanoscene(val) {
            this.sceneIndex=val.id;
            window.loadpanoscene && window.loadpanoscene(val.id, val.code);
        },
        findGuide(val) {
            const { locationX, locationY, sceneId } = val;
            if (sceneId) {
                window.backFindHotspotId && backFindHotspotId(sceneId, locationX, locationY);
            }
            this.$store.commit("SETGuIDELIST", data);
        },   //未完成
        changeGuideLocation(val) {
            const getScenePara = window.getScenePara && window.getScenePara();
            const projectId = this.$route.params.projectId;
            //const GuideData = this.$store.state.toolbarStore.GuideData;
            const data = {
                projectId, //项目ID
                locationFov: getScenePara[1], //场景的视角
                locationX: getScenePara[2], //获取的热点横坐标
                locationY: getScenePara[3], //获取的热点垂向坐标
                sceneId: getScenePara[4], //场景ID
                id: val.id, // 引导脚本列表id
                type: "GUIDE" //热点类型
            };

            hotspotDetail({ type: "put", data }, val.id).then(res => {
                if (res.suceeded) {
                    this.getGuideList();
                    window.loadpanoscene && window.loadpanoscene(val.id, val.code);
                    this.currentIndex = null;
                    Bus.$emit("updetaSuccess");
                    this.$message({
                        type: "success",
                        message: "更新成功!"
                    });
                }
            });
        },
        changeGuideName(val) {
            this.currentItem = val;
            this.shows.isOpenEditAttachment = true;
        },
        openHotspotConent(val) {
            this.currentItem = val;
            this.shows.isOpenHotspotConent = true;
        },
        selectGuideIndex(val){
            this.guideIndex=val;
            this.sceneIndex=-1;
        },
        select(index) {
            console.log("111");
            if (this.isUpDown) {
                // bug
                return false;
            }
            this.currentIndex = index;
        },
        handleClose(done) {
            done();
            this.$store.commit("TOGGLE_DRAWER", "drawerGuideContent");
        },
        delAttach(id) {
            // 删除附件
            hotspotDetail({ type: "delete" }, id).then(res => {
                if (res.suceeded) {
                    this.getGuideList();
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                }
            });
        },
        handleDel(item, index) {
            this.$confirm(`此操作将永久删 ${item.title}, 是否继续?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.delAttach(item.id);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        sortAttachment() {
            const projectId = this.$route.params.projectId;
            const hotspotIds = this.newArr.map(item => item.id);
            projectDetail(
                {
                    type: "post",
                    data: {
                        hotspotIds,
                        projectId
                    }
                },
                `${projectId}/hotspot/changeSeq`
            ).then(res => {
                if (res.suceeded) {
                    this.getGuideList();
                    console.log(res);
                }
            });
        },
        up(arr, index) {
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
            if (arr.length > 1 && index !== arr.length - 1) {
                this.newArr = this.swapItems(arr, index, index + 1);
                this.isUpDown = true;
                this.currentIndex = index + 1;
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
        closeDrawer() {
            this.$store.commit("TOGGLE_DRAWER", "drawerGuideContent");
            if (this.$store.state.toolbarStore.openGuideScene) {
                this.$store.commit("TOGGLE_DRAWER", "openGuideScene");
            }
        },
        initBus() {
            Bus.$on("updetaSuccess", () => {
                this.getGuideList();
            });
        }
    },
    mounted() {
        this.initBus();
        window._hban_addGuide = () => {
            if (!this.drawerGuideContent) {
                Bus.$emit("toolbar-hander", { type: "drawerGuideContent", index: 4 });
            }
            this.addGuide();
        };
        this.getSceneList();
    }
};
</script>

<style lang="less">
.panel_sidebar_1 {
    position: relative;
    box-shadow: none;
    .attachment {
        .title {
            height: 88px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
                font-size: 18px;
                font-family: MicrosoftYaHei;
                color: rgba(51, 51, 51, 1);
                line-height: 24px;
            }
            i {
                font-size: 24px;
                color: rgba(15, 79, 168, 1);
            }
        }
        .attachment_list {
            .header {
                display: flex;
                justify-content: space-between;
                height: 32px;
                align-items: center;
                background: rgba(248, 248, 248, 1);
                span {
                    width: 33%;
                    font-size: 14px;
                    font-family: MicrosoftYaHei;
                    color: rgba(102, 102, 102, 1);
                    line-height: 19px;
                    text-align: center;
                }
            }
            .body {
                .item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 42px;
                    border-bottom: 1px solid #eee;
                    & > div {
                        width: 33%;
                        text-align: center;
                        &.link_name {
                            width: 170px;
                            text-align: left;
                            font-size: 12px;
                            font-family: MicrosoftYaHei;
                            color: rgba(102, 102, 102, 1);
                            line-height: 19px;
                        }
                        &.operate {
                            display: flex;
                            justify-content: space-around;
                        }
                        i {
                            font-size: 12px;
                            color: rgba(15, 79, 168, 1);
                        }
                    }
                }
                .active {
                    background: rgb(255, 165, 0);
                }
            }
        }
    }
    #triangle-right {
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-left: 20px solid #eee;
        border-bottom: 10px solid transparent;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50);
    }
}
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
.guide_title{
    display: block;
    text-align:center;
    font-size: 14px;
    padding:15px 5px;
    background-color: #324155;
    color: #F7F7F7;
    cursor:pointer;
}
.guide_item_div{
    display: block;
    text-align:center;
    font-size: 14px;
    padding:15px 5px;
    background-color: #f0f0f0;
    color: #333333;
}
.guide_item{
     display: block;
     text-align: center;
     margin:5px 10px;
     cursor:pointer;
     border: none;
 }
.guide_item_active{
    display: block;
    text-align: center;
    color: #ff6900;
    margin:5px 10px;
    cursor:pointer;
    border: none;
}
.guide_bnt_group{
    display: flex;
    margin: 10px;
    padding:0px 20px;
    justify-content: space-between
}
</style>
