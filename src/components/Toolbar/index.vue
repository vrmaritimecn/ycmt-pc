<template>
    <div id="toolbar">
        <div class="item-toolbar" v-for="(item, index) in toolbarList" :key="index" @click="toolbarHander(item.type, index)" :class="{ active: index === currentIndex && isCurrentOpen[item.type] }">
            <el-tooltip class="item" effect="dark" :content="item.text" placement="left">
                <i class="iconfont" :class="[item.icon ? item.icon : '']"></i>
            </el-tooltip>
        </div>
        <!-- 简介面板 -->
        <IntroPanel></IntroPanel>
        <!-- 课件参与人员 -->
        <PersonPanel></PersonPanel>
        <!-- 附件 -->
        <AttachmentPanel></AttachmentPanel>
        <!-- 热点内容 -->
        <ScenePanel></ScenePanel>
        <!-- 课件引导 -->
        <GuidePanel></GuidePanel>
    </div>
</template>

<script>
// 左侧面板
import IntroPanel from "../Toolbar/Panel/Intro";
import PersonPanel from "../Toolbar/Panel/Person";
import AttachmentPanel from "../Toolbar/Panel/Attachment/index.vue";
import ScenePanel from "../Toolbar/Panel/Scene/index.vue";
import GuidePanel from "../Toolbar/Panel/Guide/index.vue";
import Bus from "@/components/bus/index.js";
export default {
    data() {
        return {
            toolbarList: [
                {
                    text: "简介",
                    icon: "iconxiangmu",
                    type: "drawerIntro",
                    call:""
                },
                {
                    text: "制作人员",
                    icon: "iconjiaoseleixing",
                    type: "drawerPerson",
                    call:""
                },
                {
                    text: "附件参考",
                    icon: "iconxuexi_nor",
                    type: "drawerAttachment",
                    call:""
                },
                {
                    text: "热点内容",
                    icon: "icontubiaoweb-26",
                    type: "drawerHotContent",
                    call:""
                },
                {
                    text: "引导内容",
                    icon: "icontubiaoweb-36",
                    type: "drawerGuideContent",
                    call:""
                },
                {
                    text: "在线交流",
                    icon: "icontubiaoweb-39",
                    type: "",
                    call:"SETISOPENMESSAGE"
                },
                {
                    text: "用户点评",
                    icon: "icontubiaoweb-13",
                    type: "",
                    call:"SETISOPENMESSAGE"
                },
                {
                    text: "场景地图",
                    icon: "icontubiaoweb-41",
                    type: "",
                    call:"TOGGLESCENETHUMB"
                }
            ],
            currentIndex: null
        };
    },
    components: {
        IntroPanel,
        PersonPanel,
        AttachmentPanel,
        ScenePanel,
        GuidePanel
    },
    computed: {
        isCurrentOpen: function() {
            const data = this.$store.state.toolbarStore;
            return data;
        }
    },
    methods: {
        toolbarHander(type, index) {
            this.currentIndex = index;
            if(type){
                this.$store.commit("SETTOGGLETOOLBR", type);
            }
            else if(this.toolbarList[index]["call"]){
                const call=this.toolbarList[index]["call"];
                this.$store.commit(call);
                this.$store.commit("SETTOGGLETOOLBR", "none");
            }

        },
        initBus() {
            Bus.$on("toolbar-hander", data => {
                const { type, index } = data;
                this.toolbarHander(type, index);
            });
        }
    },
    mounted() {
        this.initBus();
        window._hban_openToolbarType = type => {
            return this.isCurrentOpen[type];
        };
    }
};
</script>

<style lang="less">
#toolbar {
    width: 46px;
    height: 100%;
    background: #324155; //rgba(50, 65, 65, 1);
    padding-top: 30px;
    position: absolute;
    right: 0;
    // display: flex;
    // flex-wrap: wrap;
    .item-toolbar {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        &.active {
            i {
                color: rgb(255, 165, 0);
            }
        }
        i {
            font-size: 20px;
            color: #fff;
            cursor: pointer;
        }
    }
}
</style>
