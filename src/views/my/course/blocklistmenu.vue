<template xmlns="http://www.w3.org/1999/html">
    <div class="block-list-content">
        <el-card class="box-card" v-for="item in blist">
            <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3288116853,4251236604&fm=26&gp=0.jpg" class="image">
            <div style="padding: 5px;">
                <p style="font-size: 16px; font-weight: bold; padding-top: 5px;">"{{item.name}}"</p>
                <div class="bottom clearfix">
                    <el-button type="text" class="button">船舶参数</el-button>
                </div>
            </div>
        </el-card>
      <!--
        <el-card class="box-card">
            <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2004208792,3609046340&fm=26&gp=0.jpg" class="image">
            <div style="padding: 5px;">
                <p style="font-size: 16px; font-weight: bold; padding-top: 5px;">"鼓浪屿"轮</p>
                <div class="bottom clearfix">
                    <el-button type="text" class="button">船舶参数</el-button>
                </div>
            </div>
        </el-card>
        <el-card class="box-card">
            <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2108061896,2747657363&fm=26&gp=0.jpg" class="image">
            <div style="padding: 5px;">
                <p style="font-size: 16px; font-weight: bold; padding-top: 5px;">"大智"轮</p>
                <div class="bottom clearfix">
                    <el-button type="text" class="button">船舶参数</el-button>
                </div>
            </div>
        </el-card>
     -->
    </div>
</template>

<script>
    export default {
        name: "block-list",
        data() {
            return {
              currentDate: new Date(),
            };
        },

        computed:{
          blist(){
            return this.$store.getters.getUserResource
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
