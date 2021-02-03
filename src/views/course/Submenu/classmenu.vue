<template>
    <div class="three_menu_list01">
        <ul>
            <li
                    v-for="(item, index) in classList"
                    :key="index"
                    :class="[
                        $route.query.classListId.toString() === item.id.toString() ? 'active' : ''
                    ]"
                    @click="handClass(item)"
                    class="cursor"
            >
                <span>{{ item.name }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return{
                classList:[]
            }
        }
    };
</script>

<style lang="less">

.three_menu_list {
    margin: 20px 0;
    ul {
        display: flex;
        flex-wrap: wrap;
        li {
            margin-right: 25px;
            margin-bottom: 14px;
            &.active {
                span {
                    color: rgba(255, 157, 59, 1);
                    border-bottom: 2px solid rgba(255, 157, 59, 1);
                    padding-bottom: 4px;
                    font-weight: bold;
                }
            }
            span {
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: rgba(102, 102, 102, 1);
                line-height: 19px;
            }
        }
    }
}
</style>