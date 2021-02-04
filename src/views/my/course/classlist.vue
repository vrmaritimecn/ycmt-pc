<template>
    <div class="classlist">
        <span class="span">全部</span>
        <span class="span">这是分类</span>
        <span class="span">这是分类</span>
        <span class="span">这是分类</span>
        <span class="span">这是分类</span>
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
        line-height: 90px;
    }
    .span{
        background-color: #606266;
        padding:5px 10px;
        border-radius: 5px;
        font-size:14px;
        color: #ffffff;
        margin-right: 10px;
        vertical-align:bottom;
    }
</style>