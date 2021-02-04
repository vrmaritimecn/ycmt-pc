<template>
    <div class="modulelist">
        <div class="module-name-card">
            <img class="moduleicon" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2904989259,3650743495&fm=26&gp=0.jpg"/><span>技术解读</span>
        </div>
        <div class="module-name-card">
            <img class="moduleicon" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2904989259,3650743495&fm=26&gp=0.jpg"/><span>技术解读</span>
        </div>
        <div class="module-name-card">
            <img class="moduleicon" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2904989259,3650743495&fm=26&gp=0.jpg"/><span>技术解读</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "modulelist"
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
        .module-name-card{
            display: inline-block;
            height: 60px;
            width: 140px;
            border-radius: 5px;
            background-color: #ffffff;
            margin-right: 30px;
            margin-top: 20px;
            line-height: 60px;
            .moduleicon{
                width:40px;
                height:40px;
                border-radius: 20px;
                margin: 0px 10px;
            }
        }
    }
</style>