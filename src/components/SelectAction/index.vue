<template>
    <div class="select-content">
        <div class="select-header">
            <span>{{ title }}</span>
        </div>
        <div class="select-body">
            <div class="action_list">
                <!--ul>
                    <li
                        v-for="(item, index) in list"
                        :key="index"
                        @click="select(item.src, index, item)"
                        class="ui-lazyLoad-pic"
                        :class="{ active: index === currentIndex }"
                        v-skeleton="
                            item.src.indexOf('/static/app') !== -1
                                ? globalConfig.imagePath + item.src
                                : item.src
                        "
                    >
                    </li>
                </ul-->
                <el-row style="width:260px;">
                    <el-col :span="6" v-for="(item, index) in list">
                        <img :class="currentIndex==index? 'action_pic_active':'action_pic'"
                             :src="globalConfig.imagePath + item.value"
                             @click="select(item, index)"/>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        placeholder: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
        list: {
            type: Array,
            default: []
        },
        onSelect: {
            type: Function,
            default: () => {}
        },
        activeIndex: {
            type: Number,
            default: 0
        }
    },
    watch: {
        activeIndex: function(val) {
            this.currentIndex = val;
        }
    },
    data() {
        return {
            currentIndex: null
        };
    },
    methods: {
        /*
        select(url, index, item) {
            console.log(this.currentIndex, "currentIndex");
            this.currentIndex = index;
            if (item.src.indexOf("/static/app") !== -1) {
                this.onSelect && this.onSelect(item.src);
            } else {
                this.onSelect && this.onSelect(item.desc);
            }
        },

         */
        select(item,index) {
            this.currentIndex = index;
            console.log(this.currentIndex);
            if(this.title=="选择图例"){
                this.onSelect && this.onSelect(item.value);
            }
            else{
                this.onSelect && this.onSelect(item.detail);
            }
        }
    }
}
</script>

<style lang="less">
.select-content {
    width: 260px;
    .select-header {
        width: 100%;
        text-align: center;
        height: 20px;
        margin-bottom: 20px;
    }
    .select-body {
        height:260px;
        width: 260px;
        overflow-y: auto;
        .action_list {
            ul {
                // display: flex;
                // flex-wrap: wrap;
                // justify-content: space-between;
                li {
                    width: 48px;
                    height: 48px;
                    margin-right: 10px;
                    margin-bottom: 8px;
                    float: left;
                    // background: rgba(221, 221, 221, 1);
                    img {
                        width: 100%;
                        height: 100%;
                    }
                    &.active {
                        border: 1px solid #ffa500;
                    }
                }
            }
        }
        .desc {
            width: 97%;
        }
    }
}
.action_pic_active{
    margin: 5px;
    width: 46px;
    height: 46px;
    border-radius: 4px;
    border: 2px solid #ff6900;
}
.action_pic{
    margin: 5px;
    width: 50px;
    height: 50px;
    border-radius: 4px;
}
</style>
