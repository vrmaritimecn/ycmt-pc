<template>
    <div class="modulelist" v-if="plateformState==0">
        <div  v-for="(item,index) in mlist" :class="ind==index? 'module-name-card-active' : 'module-name-card'" @click="handclick(index,item.id)">
            <img class="moduleicon" src="./image/icon-1.png"/><span class="modulename" >{{item.name}}</span>
        </div>
    </div>
    <div class="modulelist" v-else>
        <div  v-for="(item,index) in pmlist" :class="ind==index? 'module-name-card-active' : 'module-name-card'" @click="firsthandclick(index,item.id)">
            <img class="moduleicon" src="./image/icon-1.png"/><span class="modulename" >{{item.name}}</span>
        </div>
    </div>
</template>

<script>
    import { projectClass } from "@/model/api";
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
          pmlist(){
              return this.$store.getters.getPlatformResource
          },
          plateformState(){
              return this.$store.getters.getPlatformState
          },
        ...mapGetters([
          'getBlockId',
           'getModuleId',
        ])
      },
      methods:{
        handclick(index,id){
          this.$store.commit('SETMODULEID', id);
          this.ind = index;
        },
          firsthandclick(index,id)
          {
              this.ind = index;
              this.$store.commit("SETMODULEID",id);
              this.$nextTick(() => {
                  projectClass({
                      type:"GET",
                      data:{
                          blockId: 5,
                          moduleId: id
                      }
                  }).then(res => {
                      if (res.suceeded) {
                          this.$store.commit({
                              type: "SET_PLATFORMCLASS_INFO",
                              plylaod: res.data.content
                          });
                      }
                  });
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
