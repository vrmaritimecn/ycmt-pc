<template>
    <div class="panel_sidebar" v-if="drawerAttachment">
        <div class="panel_sidebar_title"><span>添加课件参考</span><i class="iconfont icontubiaoweb-24 cursor" @click="addAttachment"></i></div>
        <div class="panel_sidebar_content">
            <el-row>
                <el-col :span="24" style="margin: 10px 0px;" v-for="(item, index) in attachmentList" :key="index" :class="{ active: index === currentIndex }" @click="select(index)">
                    <el-card :body-style="{ padding: '0px'}">
                        <span :class="attachmentIndex==item.id?'att_title_active':'att_title'" @click="attachmentIndex=item.id">{{item.title}}</span>
                        <span class="att_bnt_group">
                            <i class="iconfont icontubiaoweb-28 cursor" @click="editOpenEditAttachmentName(item, index)" ></i>
                            <i class="iconfont icontubiaoweb-29 cursor" @click="editAttachment(item)"></i>
                            <i class="iconfont icontubiaoweb-22 cursor" @click="up(attachmentList, index)" ></i>
                            <i class="iconfont icontubiaoweb-23 cursor" @click="down(attachmentList, index)" ></i>
                            <i class="iconfont icontubiaoweb-27 cursor" @click="handleDel(item, index)"></i>
                        </span>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <AttachmentComponent
            :visible.sync="shows.isOpenAttachment"
            :hotspotId="currentItem.id"
            v-if="currentItem.id"
            :orderList="['文本','图片','文章', '音频', '视频']"
        ></AttachmentComponent>


        <!-- 修改附件弹窗 -->
        <editAttachmentDialog
            :visible.sync="shows.isOpenEditAttachment"
            :data="currentItem"
            :onSuccess="getAttachmentList"
        ></editAttachmentDialog>
    </div>
</template>

<script>

import { mapState } from "vuex";
import AttachmentComponent from "@/components/Attachment";
import editAttachmentDialog from "./editAttachment";
import { hotspot, hotspotDetail, projectDetail } from "@/model/api";
import Bus from "@/components/bus/index.js";

export default {
    name: "Attachment",
    data() {
        return {
            shows: {
                isOpenAttachment: false, // 附件弹窗
                isOpenEditAttachment: false // 修改附件弹窗
            },
            attachmentIndex:"",
            attachmentList: [], // 获取附件列表
            newArr: [], //
            currentItem: {},
            isUpDown: false,
            currentIndex: null, // 当前选择行
            orderList:[
                {
                    name:"文章",
                    status:true
                },{
                    name:"音频",
                    status:true
                },{
                    name:"视频",
                    status:true
                },{
                    name:"文本",
                    status:true
                },{
                    name:"图片",
                    status:true
                }
            ]
        };
    },
    components: {
        AttachmentComponent,
        editAttachmentDialog
    },
    computed: {
        ...mapState({
            drawerAttachment: state => state.toolbarStore.drawerAttachment
        })
    },
    watch: {
        drawerAttachment(newVal, oldVal) {
            if (newVal) {
                this.getAttachmentList();
            }
        }
    },
    methods: {
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
            this.$store.commit("TOGGLE_DRAWER", "drawerAttachment");
        },
        delAttach(id) {
            // 删除附件
            hotspotDetail({ type: "delete" }, id).then(res => {
                if (res.suceeded) {
                    this.getAttachmentList();
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                }
            });
        },
        handleDel(item, index) {
            this.attachmentIndex=item.id;
            this.$confirm(`此操作将永久删 ${item.title}, 是否继续?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.delAttach(item.id);
                    this.attachmentIndex="";
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        addAttachment() {
            const projectId = this.$route.params.projectId;
            hotspot({
                type: "post",
                data: {
                    projectId,
                    title: "新增课件参考",
                    type: "ATTACHMENT"
                }
            }).then(res => {
                if (res.suceeded) {
                    this.$message({
                        type: "success",
                        message: "操作成功"
                    });
                    this.getAttachmentList();
                }
            });
        },
        getAttachmentList() {
            const projectId = this.$route.params.projectId;
            // 通过任务id获取项目的有关信息
            hotspotDetail(
                {
                    type: "GET",
                    data: {
                        projectId,
                        type: "ATTACHMENT",
                        page: "1",
                        size: "1000"
                    }
                },
                "/all"
            ).then(res => {
                if (res.suceeded) {
                    this.attachmentList = res.data;
                    console.log(res.data, "attach");
                } else {
                }
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
                    this.getAttachmentList();
                    console.log(res);
                }
            });
        },
        up(arr, index) {
            this.attachmentIndex=arr[index].id
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
            this.attachmentIndex=arr[index].id
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
        editOpenEditAttachmentName(data, index) {
            // 修改附件名称弹窗
            this.attachmentIndex=data.id
            this.currentIndex = index;
            this.currentItem = {};
            this.currentItem = data;
            this.shows.isOpenEditAttachment = true;
            console.log(data);
        },
        editAttachment(data) {
            this.attachmentIndex=data.id
            this.currentItem = data;
            this.shows.isOpenAttachment = true;
        }
    },
    mounted() {
        // 暴露给全景
        window._hban_addAttachment = () => {
            if (!this.drawerAttachment) {
                Bus.$emit("toolbar-hander", { type: "drawerAttachment", index: 2 });
            }
            this.addAttachment();
        };
    }
};
</script>

<style lang="less">
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
        .attachment-header {
            display: flex;
            // justify-content: space-between;
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
        .attachment-body {
            .item {
                display: flex;
                // justify-content: space-between;
                align-items: center;
                height: 42px;
                // min-height: 42px;
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
                        margin-left: 4px;
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
.att_title_active{
    display: block;
    text-align:center;
    font-size: 14px;
    padding:15px 5px;
    background-color: #324155;
    border-bottom: thin solid #e6a23c;
    color: #e6a23c;
    cursor:pointer;
}
.att_title{
    display: block;
    text-align:center;
    font-size: 14px;
    padding:15px 5px;
    background-color: #324155;
    color: #F7F7F7;
    cursor:pointer;
}
.att_bnt_group{
    display: flex;
    margin: 10px;
    padding:0px 20px;
    justify-content: space-between;
}
</style>
