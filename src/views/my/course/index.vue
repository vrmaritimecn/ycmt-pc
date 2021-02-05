<template>
    <div class="course">
        <div class="course_nav">
            <Title title="船舶资源" :isMore="false"></Title>
            <div class="course_list">
                <!--<Nav :modulesList="modulesList" path="/my/course"></Nav>-->
                <blocklistmenu></blocklistmenu>
            </div>
        </div>
        <div class="course_content">
            <!--<Submenu :modulesList="modulesList" path="/my/course"></Submenu>-->
            <modulelistmenu></modulelistmenu>
            <classlistmenu></classlistmenu>
            <div class="course_list" v-loading="loading">
                <CourseItem
                        v-for="(item, index) in recommendProjectList"
                        :key="index"
                        :item="item"
                ></CourseItem>
            </div>
        </div>
    </div>
</template>

<script>
import Nav from "@/components/common/Nav";
import Title from "@/components/common/Title";
import Submenu from "../../course/Submenu";
import CourseItem from "@/components/course";
import { project } from "@/model/api";
import store from "@/widget/store";
import blocklistmenu from "./blocklistmenu";
import modulelistmenu from "./modulelistmenu";
import classlistmenu from "./classlistmenu";
import {mapGetters} from 'vuex';
import utils from "@/widget/utils";
export default {
    data() {
        return {
            recommendProjectList: [],
            modulesList: store.get("modulesList", "local"),
            pageIndex: 1,
            isScrollLoad: true,
            showLoading: false,
            pageTotal: 0,
            loading: false
        };
    },
    components: {
        Nav,
        Title,
        Submenu,
        CourseItem,
        blocklistmenu,
        modulelistmenu,
        classlistmenu
    },

    computed:{
      ...mapGetters([
        'getModuleId '
      ])
    },

    methods: {
      /*
        getCourseList() {
            this.loading = true;
            let { moduleId, blockId, classListId } = this.$route.query;
            classListId = classListId.toString() === "-1" ? "" : classListId;
            this.recommendProjectList = []; // 清空
            project({
                type: "GET",
                data: {
                    page: 1,
                    size: 100000,
                    moduleId,
                    classId: classListId,
                    blockId,
                    publishFlg: 1
                }
            }).then(res => {
                if (res.suceeded) {
                    this.loading = false;
                    const { content, total } = res.data;
                    this.recommendProjectList = this.recommendProjectList.concat(content || []);
                }
            });
        }
        */

      getCourseList() {
        this.loading = true;
        //let { moduleId, blockId, classListId } = this.$route.query;
        //classListId = classListId.toString() === "-1" ? "" : classListId;
        this.recommendProjectList = []; // 清空
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
            this.recommendProjectList = this.recommendProjectList.concat(content || []);
          }
        });
      }
    },
    watch: {
        $route: function() {
            this.getCourseList();
        }
    },
    mounted() {
        this.getCourseList();
    }
};
</script>

<style lang="less">
.course {
    display: flex;
    height: 100%;
    overflow: hidden;
    .course_nav {
        width: 294px;
        height:calc(100% - 55px);
        min-width: 294px;
        .course_list {
            background-color: #fff;
            padding-top:20px;
            overflow-y: scroll;
            height: 100%;
            /*
            & > nav {
                ul {
                    li {
                        margin: 0 auto;
                        margin-top: 40px;
                        &.active {
                            transform: scale(1.1);
                            // box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
                        }
                    }
                }
            }
            */

        }

    }
    .course_content {
        padding: 16px;
        margin-left: 8px;
        flex: 1;
        background: #fff;
        min-width: 666px;
        // height: 100%;
        .course_list {
            overflow-y: scroll;
            height: calc(100% - 206px);
            padding-right: 10px;
            & > .course-content-item {
                .course-item-thumb {
                    width: 125px !important;
                    height: 125px !important;
                }
            }
        }
    }
}
</style>
