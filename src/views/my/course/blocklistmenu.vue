<template xmlns="http://www.w3.org/1999/html">
    <div class="block-list-content">
        <el-card class="box-card" v-for="(item, index) in blist" >
          <!--img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3288116853,4251236604&fm=26&gp=0.jpg" class="image"-->
          <img :src="globalConfig.imagePath + item.imageUrl" :alt="item.name" :class="ind==index? 'image-active' : 'image'" @click="handClick(index)"/>
          <div style="padding: 5px;">
                <p style="font-size: 16px; font-weight: bold; padding-top: 5px;">船名："{{item.name}}"</p>
                <div class="bottom clearfix">
                    <el-button type="text" class="button" >船舶参数</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "block-list",
        data() {
            return {
              currentDate: new Date(),
              ind: -1
            };
        },

        computed:{
          blist(){
            return this.$store.getters.getUserBlockResource
          }
        },

        methods:{
          handClick(index){
            this.$store.commit('SETBLOCKINDEX', index);
            this.ind = index;
          }
        }
    };
</script>

<style lang="less">

    .block-list-content {
        margin-bottom: 20px;
        width: 100%;
    }

    .box-card {
        width: 92%;
        margin-left: 4%;
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
        box-shadow: 0px 0px 8px #888888;
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
