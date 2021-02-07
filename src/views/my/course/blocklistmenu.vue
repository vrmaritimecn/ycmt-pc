<template xmlns="http://www.w3.org/1999/html">
    <div class="block-list-content">
        <el-card class="box-card">
            <img src="http://www.delacie.com//uploads/allimg/190814/193A94446_0.jpg" alt="云船码头" :class="ind==-1? 'image-active' : 'image'"  @click="handFirstClick(-1)"/>
            <div style="padding: 5px;">
                <p style="font-size: 16px; font-weight: bold; padding-top: 5px;">云船码头</p>
                <div class="bottom clearfix">
                    <el-popover
                            placement="bottom"
                            width="300"
                            trigger="hover"
                            content="*******"
                    >
                        <el-button  type="text" class="button" slot="reference">应用简介</el-button>
                    </el-popover>
                </div>
            </div>
        </el-card>
      <el-card class="box-card" v-for="(item, index) in blist" >
          <img :src="globalConfig.imagePath + item.imageUrl" :alt="item.name" :class="ind==index? 'image-active' : 'image'" @click="handClick(index, item.id)"/>
          <div style="padding: 5px;">
                <p style="font-size: 16px; font-weight: bold; padding-top: 5px;">船名："{{item.name}}"</p>
                <div class="bottom clearfix">
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
    export default {
        name: "blocklist",
        data() {
            return {
              ind: -1,
            };
        },

        computed:{
          blist(){
            return this.$store.getters.getUserBlockResource
          }
        },

        methods:{
          handClick(index,id){
            this.ind = index;
              this.$store.commit('SETUSERSTATE');
            this.$store.commit("SETBLOCKID",id);
          },
            handFirstClick(index){
                this.ind = parseInt(index);
                this.$store.commit('SETPLATFORMSTATE');
                this.$store.commit("SETBLOCKID",5);//this.$store.state.platformblock[0]["blockId"]);
                this.$store.commit("SETMODULEID",this.$store.state.platformblock[0]["id"]);
            }
        },

        mounted() {
        }
    };
</script>

<style lang="less">

    .block-list-content {
        margin-bottom: 20px;
        width: 100%;
    }

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

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
</style>
