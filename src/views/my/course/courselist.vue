<template>
    <el-row :gutter="20">
        <el-col :span="6" v-for="(item,index) in projectlist" >
            <el-card :body-style="{ padding: '0px' }">
                <div class="image-mask"><img :src="globalConfig.imagePath + item.imageUrl" class="image" @click="goDetail(item)"></div>
                <div style="padding: 14px;">
                    <span class="name-span">{{item.name}}</span>
                    <div class="bottom clearfix">
                        <span :class="item.publicFlg==1? 'tip-span-0' : 'tip-span-1'" class="tip-span">{{ item.publicFlg | formPublicFlg }}</span>
                        <el-popover
                                placement="bottom"
                                width="300"
                                trigger="hover"
                                :content="item.detail"
                                >
                            <el-button  type="text" class="button" slot="reference">简介</el-button>
                        </el-popover>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { project,projectDetail } from "@/model/api";

    export default {
        name: "courselist",

        data(){
            return {
                //visible: false,
                projectlist:[],
                loading: false
            }
        },
        methods:{
            getCourseList() {
                this.loading = true;
                let list = [];
                project({
                    type: "GET",
                    data: {
                        page: 1,
                        size: 100000,
                        moduleId: this.mId,
                        classId: this.cId<0? "" : this.cId,
                        blockId: this.bId,
                        publishFlg: 1,
                        publicFlg: this.$store.getters.getUserStatus? "" : 1
                    }
                }).then(res => {
                    if (res.suceeded) {
                        this.loading = false;
                        const { content, total } = res.data;
                        list = list.concat(content || {});
                        this.$store.commit("SETPROJECTLIST",list);
                    }
                });
            },
            goDetail({ id, name }) {
                if (!window.localStorage.getItem("authorization")) {
                    return this.$store.commit("TOGGLE_LOGIN");
                }
                this.getProjectDetail(id);
                const params = {
                    taskId: "0",
                    projectId: id,
                    from: "2",
                    name
                };
                this.$router.push({
                    name: "panoEditor",
                    params
                });
                this.$store.commit("SETHISTROY", {
                    path: `0/${id}/1`,
                    params
                });
            },
            getProjectDetail(projectId){

                projectDetail(
                    {
                        type: "GET"
                    },
                    projectId
                ).then(res => {
                    if (res.suceeded) {
                        this.$store.commit("SET_PROJECT_DATA",res.data);
                    }
                });
            }
        },
        computed:{
            bId(){
                return this.$store.getters.getBlockId
            },
            mId(){
                return this.$store.getters.getModuleId
            },
            cId(){
                return this.$store.getters.getClassId
            },
            ...mapGetters([
                "getClassList",
                "getProjectList"
            ])
        },
        watch:{
            getClassList:function() {
                this.getCourseList();
            },
            getProjectList: function() {
                this.projectlist=this.$store.getters.getProjectList
            }
        }
    };
</script>

<style lang="less">
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

    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 10px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
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

    .tip-span-0{
        background-color: #55a532;
        border-radius: 5px;
        padding:3px 6px;
        color:#F7F7F7;
    }

    .tip-span-1{
        background-color: #ff0000;
        border-radius: 5px;
        padding:3px 6px;
        color:#F7F7F7;
    }
    .name-span{
        display: block;
        height: 30px;
        vertical-align:middle;
        font-size: 14px;
        font-weight: bold;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
</style>