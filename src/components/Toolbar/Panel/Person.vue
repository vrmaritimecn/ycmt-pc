<template>
    <!-- <el-drawer
        title="我是标题"
        :visible.sync="drawerPerson"
        :with-header="false"
        :modal="true"
        :size="296"
        :before-close="handleClose"
    > -->
    <div class="panel_sidebar" v-if="drawerPerson">
        <div class="panel_sidebar_title"><span>课件制作人员</span></div>
        <div class="panel_sidebar_content">
            <el-row>
                <el-col :span="24" style="margin: 10px 0px;" v-for="(item, index) in params.userList" :key="index">
                    <el-card shadow="always" style="margin-top: 20px;">
                        <el-row>
                            <el-col :span="8">
                                <img class="use_thumb" style="" :src="globalConfig.imagePath + item.avatar" :alt="item.sgname"></img>
                            </el-col>
                            <el-col :span="16">
                                <div class="user_info">
                                    <span class="name">{{ item.sgname }}</span>
                                    <span class="department">{{ item.departmentName }}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
    <!-- </el-drawer> -->
</template>

<script>
import "@/widget/lazyLoad";
import { mapState } from "vuex";
import { projectDetail } from "@/model/api";

export default {
    name: "Person",
    data() {
        return {
            params: {
                userList: []
            }
        };
    },
    computed: {
        ...mapState({
            drawerPerson: state => state.toolbarStore.drawerPerson
        })
    },
    watch: {
        drawerPerson(newVal, oldVal) {
            if (newVal) {
                this.getProjectDetail();
            }
        }
    },
    methods: {
        handleClose(done) {
            done();
            this.$store.commit("TOGGLE_DRAWER", "drawerPerson");
        },
        getProjectDetail() {
            // 获取课件参与人员列表
            const projectId = this.$route.params.projectId;
            projectDetail(
                {
                    type: "GET"
                },
                projectId
            ).then(res => {
                if (res.suceeded) {
                    this.params.userList = res.data.userList;
                } else {
                }
            });
        }
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
                line-height:44px;
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
    .use_thumb{
        width: 60px;
        height: 60px;
        border-radius:2px;
    }
    .user_info{
        text-align: center;
        .name{
            font-size: 14px;
            font-weight: bold;
            display: block;
            margin-bottom: 15px;
        }
        .department{
            font-size: 14px;
            padding:5px 10px;
            color: #fff;
            background-color: #324155;
            border-radius: 2px;
        }
    }
</style>
