<template xmlns="http://www.w3.org/1999/html">
    <div class="block-list-content">
        <el-card class="box-card" v-for="(item, index) in pBlist" >
            <img :src="globalConfig.imagePath + item.imageUrl"
                 :alt="item.name" :class="id==item.id? 'image-active' : 'image'"
                 @click="selectPlatformBlock(index, item.id)"/>
            <div style="padding: 5px;">
                <p style="font-size: 16px; font-weight: bold; padding: 8px 0px;">{{item.name}}</p>
                <div class="bottom clearfix">
                    <span class="tip-span-0">公共</span>
                    <el-popover
                            placement="bottom"
                            width="300"
                            trigger="hover"
                            :content="item.detail"
                    >
                        <el-button  type="text" class="button" slot="reference">船舶参数</el-button>
                    </el-popover>
                </div>
            </div>
        </el-card>
      <el-card class="box-card" v-for="(item, index) in blist" >
          <img :src="globalConfig.imagePath + item.imageUrl"
               :alt="item.name" :class="id==item.id? 'image-active' : 'image'"
               @click="selectUserBlock(index, item.id)">
          <div style="padding: 5px;">
                <p style="font-size: 16px; font-weight: bold; padding: 8px 0px;">{{item.name}}</p>
                <div class="bottom clearfix">
                    <span class="tip-span-1">私有</span>
                  <el-popover
                    placement="bottom"
                    width="300"
                    trigger="hover"
                    :content="item.detail"
                    >
                    <el-button  type="text" class="button" slot="reference">船舶参数</el-button>
                  </el-popover>
                </div>
            </div>
      </el-card>
    </div>
</template>


<script>
    import { mapGetters } from "vuex";
    import { projectModule } from "@/model/api";

    export default {
        name: "blocklist",
        data() {
            return {
                id: "",
            };
        },

        computed:{
            blist(){
                return this.$store.getters.getUserBlockList
            },
            pBlist(){
                return this.$store.getters.getPlatformBlockList
            },
            ...mapGetters([
                "getBlockId"
            ])
        },
        watch:{
            getBlockId:function() {
                this.id=this.$store.getters.getBlockId;
            }
        },
        methods:{
            selectUserBlock(index,id){
                this.id = id;
                this.getUserBlockModuleList(id);
                this.$store.commit('SETUSERSTATUS');
                this.$store.commit("SETBLOCKID",id);
            },
            selectPlatformBlock(index,id){
                this.id = id;
                this.getPlatformBlockModuleList(id);
                this.$store.commit('SETPLATFORMSTATUS');
                this.$store.commit("SETBLOCKID",id);//this.$store.state.platformblock[0]["blockId"]);
            },
            getPlatformBlockModuleList(val){
                projectModule({
                    type: "get",
                    data: {
                        blockId: val
                    }
                }).then(res => {
                    if (res.suceeded) {
                        this.$store.commit("SETMODULELIST", res.data);
                        this.$store.commit("SETMODULEID", res.data[0]["id"]);
                        this.$store.commit("SETCLASSLIST", res.data[0]["classList"]);
                        this.$store.commit("SETCLASSID", -1);
                    }
                });
            },
            getUserBlockModuleList(val){
                var userBlockList=this.$store.getters.getUserBlockList;
                for(var i=0; i<userBlockList.length; i++){
                    if(userBlockList[i]["id"]==val){
                        this.$store.commit("SETMODULELIST",userBlockList[i]["moduleList"]);
                        this.$store.commit("SETMODULEID", userBlockList[i]["moduleList"][0]["id"]);
                        this.$store.commit("SETCLASSLIST", userBlockList[i]["moduleList"][0]["classList"]);
                        this.$store.commit("SETCLASSID", -1);
                    }
                }
            }
        },
        mounted() {
            this.id=this.$store.getters.getBlockId;
        }
    };
</script>

<style lang="less">

    .block-list-content {
        margin-bottom: 20px;
        width: 100%;
        .box-card {
            width: 90%;
            margin-left: 5%;
            margin-bottom: 20px;
        }
        .time {
             font-size: 13px;
             color: #999;
         }

        .bottom {
            margin-top: 13px;
            line-height: 12px;
        }

        .button {
            padding: 0;
            float: right;
        }

        .image {
            width: 100%;
            border-radius: 2px;
            display: block;
            cursor: pointer;
        }

        .image-active {
            width: 100%;
            border-radius: 2px;
            display: block;
            box-shadow: 0px 0px 16px #333333;
            cursor: pointer;
        }

        .tip-span-0{
            background-color: #55a532;
            border-radius: 2px;
            padding:4px 8px;
            color:#F7F7F7;
            font-size: 14px;
        }

        .tip-span-1{
            background-color: #ff0000;
            border-radius: 2px;
            padding:4px 8px;
            color:#F7F7F7;
            font-size: 14px;
        }
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
