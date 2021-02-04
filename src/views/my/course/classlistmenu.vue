<template>
    <div class="classlist">
        <span class="span">全部</span>
        <span class="span">船舶结构和布置</span>
        <span class="span">轮机设备</span>
        <span class="span">救生设备</span>
        <span class="span">消防设备</span>
        <span class="span">防污染设备</span>
        <span class="span">航行安全设备</span>
        <span class="span">无线电设备</span>
        <span class="span">船舶结构和布置</span>
        <span class="span">轮机设备</span>
        <span class="span">救生设备</span>
        <span class="span">消防设备</span>
    </div>
</template>

<script>
    export default {
        name: "classlist"
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
    }
</style>