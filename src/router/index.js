import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// 解决 在使用ElementUi时点击同一个路由，页面报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

export default new Router({
    mode: "history",
    scrollBehavior(to, from, savePosition) {
        if (savePosition) {
            return savePosition;
        } else {
            return { x: 0, y: 0 };
        }
    },
    routes: [
        {
            path: "/",
            name: "Index",
            component: () => import("@/views/home"),
            meta: {
                title: "云船码头首页"
            }
        },
        {
            path: "/home",
            name: "home",
            component: () => import("@/views/home"),
            meta: {
                title: "云船码头首页"
            }
        },
        {
            path: "/news",
            name: "news",
            component: () => import("@/views/news"),
            meta: {
                title: "云船码头资讯"
            }
        },
        {
            path: "/news/detail/:id",
            name: "newsDetail",
            component: () => import("@/views/news/detail"),
            meta: {
                title: "资讯详情"
            }
        },
        {
            path: "/course",
            name: "course",
            component: () => import("@/views/course"),
            meta: {
                title: "公共课件"
            }
        },
        {
            path: "/my/person",
            name: "MyPerson",
            component: () => import("@/views/my/person"),
            meta: {
                title: "用户信息",
                requireLogin: true
            }
        },
        {
            path: "/my/setting",
            name: "MySetting",
            component: () => import("@/views/my/setting"),
            meta: {
                title: "编辑信息",
                requireLogin: true
            }
        },
        {
            path: "/my/task",
            name: "MyTask",
            component: () => import("@/views/my/task"),
            meta: {
                title: "任务处理",
                requireLogin: true
            }
        },
        {
            path: "/my/message",
            name: "MyMessage",
            component: () => import("@/views/my/message"),
            meta: {
                title: "任务通知",
                requireLogin: true
            }
        },
        {
            path: "/my/course",
            name: "MyCourse",
            component: () => import("@/views/my/course"),
            meta: {
                title: "平台课件",
                requireLogin: true
            }
        },
        {
            path: "/my/agora",
            name: "Myagora",
            component: () => import("@/views/my/agora"),
            meta: {
                title: "远程检查",
                requireLogin: true
            }
        },
        {
            path: "/my/p_ditor/:taskId/:projectId/:from/:modules?",
            name: "panoEditor",
            component: () => import("@/views/my/panoEditor"),
            meta: {
                title: "全景内容"
                // requireLogin: true
            }
        }
    ]
});
