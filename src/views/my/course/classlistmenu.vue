<template>
    <div class="classlist">
        <span class="span-all" @click="selectClass(-1)">全部</span>
        <span v-for="(item,index) in clist" :class="id==item.id? 'span-active' : 'span'"  @click="selectClass(item.id)">{{item.name}}</span>
    </div>
</template>

<script>

  import {mapGetters} from 'vuex'
  import { project } from "@/model/api";

    export default {
      name: "classlist",
      data() {
        return {
            id: -1
        };
      },
      computed:{
          clist(){
              return this.$store.getters.getClassList
          },
          bId(){
              return this.$store.getters.getBlockId
          },
          mId(){
              return this.$store.getters.getModuleId
          },
        ...mapGetters([
            'getModuleId',
            'getUserStatus'
          ])
      },
      methods:{
          selectClass(id){
              this.$store.commit('SETCLASSID', id);
              this.id = id;
              this.getCourseList(id);
              },
          getCourseList(val) {
              this.loading = true;
              let list = [];
              project({
                  type: "GET",
                  data: {
                      page: 1,
                      size: 100000,
                      moduleId: this.mId,
                      classId: val<0? "" : val,
                      blockId: this.bId,
                      publishFlg: 1,
                      publicFlg: this.$store.getters.getUserStatus? "" : 1
                  }
              }).then(res => {
                  if (res.suceeded) {
                      this.loading = false;
                      const { content, total } = res.data;
                      list = list.concat(content || {});
                      this.$store.commit("SETPROJECTLIST",list);
                      console.log(list);
                  }
              });
          },
      },
      watch:{
          getModuleId: function(){
              this.id = -1;
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
