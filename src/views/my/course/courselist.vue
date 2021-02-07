<template>
    <el-row :gutter="20">
        <el-col :span="6" v-for="(item,index) in projectlist" >
            <el-card :body-style="{ padding: '0px' }">
                <div class="image-mask"><img :src="globalConfig.imagePath + item.imageUrl" class="image" @click="goDetail(item)"></div>
                <div style="padding: 14px;">
                    <span class="name-span">{{item.name}}</span>
                    <div class="bottom clearfix">
                        <!--span class="time">发布时间：{{ item.publishDate }}</span-->
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
    import { project } from "@/model/api";

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
                this.projectlist = []; // 清空
                let cid= this.$store.getters.getClassId;
                if(cid<0)
                {
                    cid="";
                }
                project({
                    type: "GET",
                    data: {
                        page: 1,
                        size: 100000,
                        moduleId: this.$store.getters.getModuleId,
                        classId: cid,
                        blockId: this.$store.getters.getBlockId,
                        publishFlg: 1
                    }
                }).then(res => {
                    if (res.suceeded) {
                        this.loading = false;
                        const { content, total } = res.data;
                        this.projectlist = this.projectlist.concat(content || {});
                        //console.log(this.projectlist);
                    }
                });
            },

            goDetail({ id, name }) {
                if (!window.localStorage.getItem("authorization")) {
                    return this.$store.commit("TOGGLE_LOGIN");
                }
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
            }
        },

        watch: {
/*
            $route: function() {
                this.getCourseList();
            }
*/
            'getModuleId': function() {
                this.getCourseList();
            },
            'getClassId': function() {
                if(this.$store.state.classId !=-1)
                {
                    this.getCourseList();
                    console.log('getClassId');
                }
            }

        },
        computed:{
            ...mapGetters([
                'getModuleId',
                'getClassId'
            ])
        },
        mounted() {
            this.getCourseList();
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
    }
    .image {
        width: 100%;
        display: block;
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