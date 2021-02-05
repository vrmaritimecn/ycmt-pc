const state = {
    isOpenLogin: false,
    isOpenForget: false,
    isOpenFesetPassword: false,
    user: {},
    mobile: "",
    blockIndex: 0,
    moduleIndex: 0,
    classIndex: -1
};

const mutations = {
    TOGGLE_LOGIN(state) {
        state.isOpenLogin = !state.isOpenLogin;
    },
    SET_USER_INFO(state, { plylaod }) {
        console.log("设置用户新", plylaod);
        state.user = plylaod;
    },
    TOGGLE_FORGET(state) {
        state.isOpenForget = !state.isOpenForget;
    },
    TOGGLE_RESETPASSWORD(state) {
        state.isOpenFesetPassword = !state.isOpenFesetPassword;
    },
    SETMOBILE(state, mobile) {
        state.mobile = mobile;
    },
    SETBLOCKINDEX(state, index) {
      state.blockIndex = parseInt(index);
      state.moduleIndex = 0;
      state.classIndex = -1;
    },
    SETBMODULEINDEX(state, index) {
      state.moduleIndex = parseInt(index);
      state.classIndex = -1;
    },
    SETCLASSINDEX(state, index) {
      state.classIndex = parseInt(index);
    }
};

const getters ={
    getUserBlockResource(state)
    {
      return state.user["blocks"]
    },
    getUserModuleResource(state)
    {
      return state.user["blocks"][state.blockIndex]["moduleList"]
    },
    getUserClassResource(state)
    {
      return state.user["blocks"][state.blockIndex]["moduleList"][state.moduleIndex]["classList"]
    }
};

export default {
    state,
    mutations,
    getters
};
