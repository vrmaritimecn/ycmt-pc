<template>
    <div class="modulelist">
        <div v-for="(item,index) in mlist" :class="ind==index? 'module-name-card-active' : 'module-name-card'" @click="handclick(index)">
            <img class="moduleicon" src="./image/icon-1.png"/><span class="modulename" >{{item.name}}</span>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
    export default {
      name: "modulelist",
      data() {
        return {
          ind: 0
        };
      },
      computed:{
        mlist(){
          return this.$store.getters.getUserModuleResource
        },
        ...mapGetters([
          'getBlockId'
        ])
      },
      methods:{
        handclick(index){
          this.$store.commit('SETMODULEINDEX', index);
          this.ind = index;
          const query = {
          };
          query.blockId=this.$store.getters.getBlockId;
          query.moduleId=this.$store.getters.getModuleId;
          query.classId=this.$store.getters.getClassId;
          this.$router.push({
            path: this.path,
            query
          });
        }
      },
      watch:{
        getBlockId: function(){
          this.ind = 0;
        }
      }
    };
</script>

<style lang="less">
    .modulelist{
        border-radius: 2px;
        height:100px;
        padding-left: 20px;
        margin-bottom: 10px;
        box-shadow: 0px 0px 1px #888888;
        background-color: #f6f7f8;
        min-width: 666px;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
        .module-name-card{
            display: inline-block;
            height: 60px;
            width: 140px;
            border-radius: 5px;
            background-color: #ffffff;
            margin-right: 30px;
            margin-top: 20px;
            margin-bottom: 5px;
            line-height: 60px;
            cursor: pointer;
            .moduleicon{
                width:40px;
                height:40px;
                border-radius: 8px;
                margin: 10px 10px;
            }
            .modulename{
                font-size: 14px;
            }
        }
        .module-name-card-active{
          display: inline-block;
          height: 60px;
          width: 140px;
          border-radius: 5px;
          background-color: #ffffff;
          margin-right: 30px;
          margin-top: 20px;
          margin-bottom: 5px;
          line-height: 60px;
          cursor: pointer;
          box-shadow: 0px 0px 12px #888888;
          .moduleicon{
            width:40px;
            height:40px;
            border-radius: 8px;
            margin: 10px 10px;
          }
          .modulename{
            font-size: 14px;
          }
        }
    }
</style>
