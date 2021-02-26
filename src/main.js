import Vue from "vue";
import Application from "./App.vue";
import router from "./router";
import store from "./store";
import storeStorege from "@/widget/store";
import filters from "./filters";
import utils from "@/widget/utils";
import "@/widget/skeleton";

import { mapDefaultLis } from "@/config";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

Vue.config.productionTip = false;

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.prototype.globalConfig = window.globalConfig;
window.app_source = "pc";
window.ElementUI = ElementUI;
window.Vue = Vue;

const cookieAuthorization = utils.getCookie("authorization");

const cookieUserId = utils.getCookie("userId");

if (cookieUserId) {
    storeStorege.set("userId", cookieUserId, "local");
}

if (cookieAuthorization) {
    storeStorege.set("authorization", cookieAuthorization, "local");
}


//刷新保存状态
if (sessionStorage.getItem("store")) {
    store.replaceState(
        Object.assign(
            {},
            store.state,
            JSON.parse(sessionStorage.getItem("store"))
        )
    );
    sessionStorage.removeItem("store")
}

//监听，在页面刷新时将vuex里的信息保存到sessionStorage里
window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("store", JSON.stringify(store.state));
});


router.beforeEach((to, from, next) => {
    mapDefaultLis().then(() => {
        if (to.name == "login" && window.localStorage.getItem("authorization")) {
            //解决登陆后 用户输入登录地址重定向到首页
            next({ path: "/home" });
        }

        if (to.meta.requireLogin) {
            // 是需要登录的页面

            if (window.localStorage.getItem("authorization") || cookieAuthorization) {
                // token存在 且token没有过期

                next();
            } else {
                window.fromToPage = to.fullPath;
                store.commit("TOGGLE_LOGIN");
                next(false);
                // next();
            }
        } else {
            // 不需要登录的直接next()
            next();
        }
    });
});

router.afterEach(to => {
    document.title = to.meta.title;
});
new Vue({
    el: "#app",
    router,
    store,
    render: h => h(Application)
});
