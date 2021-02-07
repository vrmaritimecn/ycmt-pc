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
                <courselist></courselist>
            </div>
        </div>
    </div>
</template>

<script>
import Nav from "@/components/common/Nav";
import Title from "@/components/common/Title";
import Submenu from "../../course/Submenu";
import CourseItem from "@/components/course";
import { project , projectModule} from "@/model/api";
import store from "@/widget/store";
import blocklistmenu from "./blocklistmenu";
import modulelistmenu from "./modulelistmenu";
import classlistmenu from "./classlistmenu";
import courselist from "./courselist";
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
        classlistmenu,
        courselist
    },

    computed:{
      ...mapGetters([
        'getModuleId '
      ])
    },

    methods: {
        getPlatformModule() {
            this.$nextTick(() => {
                projectModule({
                    type:"GET",
                    data:{
                        blockId: 5
                    }
                }).then(res => {
                    if (res.suceeded) {
                        console.log(res.data);
                        this.$store.commit({
                            type: "SET_PLATFORMBLOCK_INFO",
                            plylaod: res.data
                        });
                        this.$store.commit("SETBLOCKID", 5); //parseInt(res.data[0]["blockId"]));
                        this.$store.commit("SETMODULEID",parseInt(res.data[0]["id"]));
                    }
                });
            });
        }
    },
    watch: {
    },
    mounted() {
        this.getPlatformModule();
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
