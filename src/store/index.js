import Vue from "vue";
import Vuex from "vuex";
import loginStore from "./login";
import toolbarStore from "./toolbar";
import histroyStore from "./histroy";
import attachmentStore from "./attachment";
import blockStore from "./block";
import messageStore from "./message";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        loginStore,
        toolbarStore,
        histroyStore,
        attachmentStore,
        blockStore,
        messageStore
    }
});
