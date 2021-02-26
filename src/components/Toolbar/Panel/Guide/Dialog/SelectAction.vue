<template>
    <el-dialog
        title="添加动作"
        :visible="visible"
        :close-on-click-modal="false"
        @open="open"
        @close="close"
        width="600px"
        append-to-body
    >
        <main class="SelectAction" v-loading="loading">
            <SelectActionComp
                placeholder="图片描述"
                title="选择图例"
                :list="guideHotspotImage"
                :onSelect="url => onSelect('pic', url)"
                :activeIndex="actionImg1Index"
            ></SelectActionComp>
            <SelectActionComp
                placeholder="动作描述"
                title="选择动作"
                :list="actionList"
                :onSelect="url => onSelect('act', url)"
                :activeIndex="actionImg2Index"
            ></SelectActionComp>
        </main>
        <div slot="footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import SelectActionComp from "@/components/SelectAction";
import { hotspotContent, appConst } from "@/model/api";

import none from "../../images/action/01_none.png";
import upaction from "../../images/action/02_upaction.png";
import downaction from "../../images/action/03_downaction.png";
import leftaction from "../../images/action/04_leftaction.png";
import rightaction from "../../images/action/05_rightaction.png";
import narrowaction from "../../images/action/06_narrowaction.png";
import enlargeaction from "../../images/action/07_enlargeaction.png";
import jumpaction from "../../images/action/08_jumpaction.png";
import rotateaction from "../../images/action/09_rotateaction.png";
import swingaction from "../../images/action/10_swingaction.png";
import flashaction from "../../images/action/11_flashaction.png";
import yrotateaction from "../../images/action/12_yrotateaction.png";

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        onConfirm: {
            type: Function,
            default: () => {}
        },
        id: {
            type: [String, Number],
            default: ""
        },
        editData: {
            type: Object,
            default: {}
        }
    },
    components: {
        SelectActionComp
    },
    computed: {
        actionImg1Index: function() {
            //return this.guideHotspotImage.findIndex(item => item.src === this.params.extra);
            //return this.guideHotspotImage.findIndex(item => item.src === this.params.extra);
        },
        actionImg2Index: function() {
            //return this.actionList.findIndex(item => item.desc === this.params.content);
        }
    },
    data() {
        return {
            guideHotspotImage: [],
            loading: false,
            checkedData: {},
            actionList: [
                { value: "/static/app/gudiance/01_none.png", detail: "none" },
                { value: "/static/app/gudiance/02_upaction.png", detail: "upaction" },
                { value: "/static/app/gudiance/03_downaction.png", detail: "downaction" },
                { value: "/static/app/gudiance/04_leftaction.png", detail: "leftaction" },
                { value: "/static/app/gudiance/05_rightaction.png", detail: "rightaction" },
                { value: "/static/app/gudiance/06_narrowaction.png", detail: "narrowaction" },
                { value: "/static/app/gudiance/07_enlargeaction.png", detail: "enlargeaction" },
                { value: "/static/app/gudiance/08_jumpaction.png", detail: "jumpaction" },
                { value: "/static/app/gudiance/09_rotateaction.png", detail: "rotateaction" },
                { value: "/static/app/gudiance/10_swingaction.png", detail: "swingaction" },
                { value: "/static/app/gudiance/11_flashaction.png", detail: "flashaction" },
                { value: "/static/app/gudiance/12_yrotateaction.png", detail: "yrotateaction" }
            ],
            params: {
                // 参数
                content: "", // 内容
                extra: "", // 附件url
                hotspotId: 0, // 附件id
                // id: 0,
                // seq: 0, // 排序
                title: "", // 标题
                type: "IMAGE" // 类型
            }
        };
    },
    watch: {
        id(newVal) {
            this.params.hotspotId = newVal;
        },
        editData(newVal) {
            this.$nextTick(() => {
                this.params = { ...newVal };
            });
        }
    },
    methods: {
        open() {
            this.getActionList();
        },
        close() {
            this.$emit("update:visible", false);
        },
        save() {
            this.close();
            this.onConfirm && this.onConfirm(this.checkedData);
            this.editImages();
        },
        getActionList() {
            const modules = this.$route.params.modules === "专业英语";
            if (modules) {
                this.getActionListZYYY();
            } else {
                this.getActionListJSJD();
            }
        },
        // 获取技术截图图片list
        getActionListJSJD() {
            console.log("技术解读");
            this.loading = true;
            this.guideHotspotImage = [];
            appConst({
                type: "get",
                data: {
                    name: "PROJECT_GUIDE_HOTSPOT_IMAGE"
                }
            }).then(res => {
                if (res.suceeded) {
                    console.log(res);
                    this.loading = false;
                    this.guideHotspotImage = (res.data || []);
                }
            });
        },
        // 获取专业英语图片list
        getActionListZYYY() {
            console.log("专业英语");
            this.loading = true;
            this.guideHotspotImage = [];
            appConst({
                type: "get",
                data: {
                    name: "PROJECT_GUIDE_HOTSPOT_ROLE"
                }
            }).then(res => {
                if (res.suceeded) {
                    this.loading = false;
                    this.guideHotspotImage = (res.data || []);
                    /*
                    this.guideHotspotImage = (res.data || []).map(item => ({
                        src: item.value,
                        desc: ""
                    }));

                     */
                }
            });
        },
        onSelect(type, url, item) {
            console.log(url);
            this.checkedData[type] = url;
        },
        editImages() {
            // 修改文本
            this.params.extra = this.checkedData.pic;
            this.params.content = this.checkedData.act;
            hotspotContent(
                {
                    type: "post",
                    data: this.params
                },
                this.params.id
            ).then(res => {
                if (res.suceeded) {
                    this.$message.success("操作成功");
                    this.close();
                    this.onSuccess && this.onSuccess();
                }
            });
        }
    }
};
</script>

<style lang="less">
.SelectAction {
    display: flex;
    justify-content: space-between;
}
</style>
