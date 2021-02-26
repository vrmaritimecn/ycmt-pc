<template>
    <div class="modulelist">
        <div  v-for="(item,index) in mlist" :class="id==item.id? 'module-name-card-active' : 'module-name-card'" @click="selectModule(index,item.id)">
            <img class="moduleicon" :src="setModueIcon(item.name)"/><span class="modulename" >{{item.name}}</span>
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
          id: ""
        };
      },
      computed:{
          mlist(){
              return this.$store.getters.getModuleList
          },
          moduleConst(){
              return this.$store.getters.getModuleConst
          },
          ...mapGetters([
              "getModuleId"
          ])
      },
        watch:{
            getModuleId:function() {
                this.id=this.$store.getters.getModuleId;
            }
        },
      methods:{
          selectModule(index,id){
              this.$store.commit('SETMODULEID', id);
              this.id = id;
              for (var i=0; i<this.mlist.length;i++){
                  if(this.mlist[i]["id"]==id){
                      this.$store.commit("SETCLASSLIST", this.mlist[i]["classList"]);
                      this.$store.commit("SETCLASSID", -1);
                  }
              }
          },
          setModueIcon(val){
              for(var i=0; i<this.moduleConst.length;i++)
              {
                  if(this.moduleConst[i]["title"]==val){
                      return globalConfig.imagePath + this.moduleConst[i]["iconUrl"];
                  }
              }
          }
      },
      mounted() {
          this.id=this.$store.getters.getModuleId
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
