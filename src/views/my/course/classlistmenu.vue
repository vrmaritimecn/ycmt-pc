<template>
    <div class="classlist">
        <span class="span-all" @click="handclick(-1)">全部</span>
        <span v-for="(item,index) in clist" :class="ind==index? 'span-active' : 'span'"  @click="handclick(index)">{{item.name}}</span>
    </div>
</template>

<script>

  import {mapGetters} from 'vuex'

    export default {
      name: "classlist",
      data() {
        return {
          ind: -1
        };
      },
      computed:{
        clist(){
          return this.$store.getters.getUserClassResource
        },
        ...mapGetters([
            'getModuleId'
          ])
      },
      methods:{
        handclick(index){
          console.log(index)
          this.$store.commit('SETCLASSINDEX', index);
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
        getModuleId: function(){
          this.ind = -1;
        }
      }
    };
</script>

<style lang="less">
    .classlist{
        height:90px;
        padding: 5px;
        margin-bottom: 5px;
        margin-bottom: 10px;
        border-bottom: #0e6eb6;
        border-bottom:1px solid #dddddd;
        min-width: 666px;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
        //line-height: 90px;
    }
    .span{
        display: inline-block;
        background-color: #606266;
        padding:5px 10px;
        border-radius: 5px;
        font-size:12px;
        color: #ffffff;
        margin-right: 10px;
        margin-bottom: 5px;
        margin-bottom: 5px;
       cursor: pointer;
    }
    .span-active{
      display: inline-block;
      background-color: #00a0e8;
      padding:5px 10px;
      border-radius: 5px;
      font-size:12px;
      color: #ffffff;
      margin-right: 10px;
      margin-bottom: 5px;
      margin-bottom: 5px;
      cursor: pointer;
    }
    .span-all{
      display: inline-block;
      background-color: #fdac33;
      padding:5px 10px;
      border-radius: 5px;
      font-size:12px;
      color: #ffffff;
      margin-right: 10px;
      margin-bottom: 5px;
      margin-bottom: 5px;
      cursor: pointer;

    }
</style>
