const state = {
    enterpriseId:0,
    departmentId:0,
    blockIndex: 0,
    moduleIndex: 0,
    classIndex: -1,
    classList:[],
    blockId: 0,
    moduleId: 0,
    moduleList:[],
    classId: -1,
    userData:{},
    userId:-1,
    userblock: [],
    userState:false,
    userBlockList: {},
    platformblock: {},
    platformBlockList: {},
    platformState: 1,
    platformClass: [],
    moduleConst:[],
    projectList:[],
    sceneId:-1,
};

const mutations = {
    SETENTERPRISEID(state, index) {
        state.enterpriseId = index
    },
    SETDEPARTMENTID(state, index) {
        state.departmentId = index
    },
    SET_USERBLOCKLIST_INFO(state, {plylaod}) {
        console.log("用户block", plylaod);
        state.userBlockList = plylaod;
    },
    SET_USERBLOCK_INFO(state, plylaod) {
        state.userblock = plylaod;
    },
    SET_PLATFORMBLOCK_INFO(state, plylaod) {
        state.platformblock = plylaod;
    },
    SET_PLATFORMBLOCKLIST_INFO(state, plylaod) {
        state.platformBlockList = plylaod;
    },
    SET_PLATFORMCLASS_INFO(state, plylaod) {
        state.platformClass = plylaod;
    },
    SETBLOCKID(state, index) {
        state.blockId = index
        state.classId = -1;
    },
    SETMODULELIST(state, plylaod) {
        state.moduleList = plylaod;
        state.classId = -1;
    },
    SETMODULEID(state, index) {
        state.moduleId = index;
        state.classId = -1;
    },
    SETCLASSID(state, index) {
        state.classId = index;
    },
    SETCLASSLIST(state, plylaod) {
        state.classList = plylaod;
    },
    SET_USERDATA(state,plylaod){
        state.userData=plylaod
    },
    SET_USERID(state,index){
        state.userId=index
    },
    SETPLATFORMSTATUS(state){
        state.userState=false;
    },
    SET_MODULECONST(state, plylaod){
        state.moduleConst=plylaod
    },
    SETPROJECTLIST(state, plylaod){
        state.projectList=plylaod
    },
    SETSCENEID(state,index){
        state.sceneId=index
    }
};

const getters ={
    getEnterpriseId(state){
        return state.enterpriseId
    },
    getDepartmentId(state){
        return state.departmentId
    },
    getUserBlockList(state){
        return state.userBlockList
    },
    getPlatformBlockList(state){
        return state.platformBlockList
    },
    getBlockId(state)
    {
        return state.blockId
    },
    getModuleList(state)
    {
        return state.moduleList
    },
    getModuleId(state)
    {
        return state.moduleId
    },
    getClassId(state)
    {
        return state.classId
    },
    getClassList(state)
    {
        return state.classList
    },
    getUserData(state){
        return state.userData
    },
    getUserId(state){
        return state.userId
    },
    getUserStatus(state)
    {
        return state.userState
    },
    getPlatformClassList(state)
    {
        return state.platformClass
    },
    getModuleConst(state) {
        return state.moduleConst
    },
    getProjectList(state) {
        return state.projectList
    },
    getSceneId(state) {
        return state.sceneId
    }
};

export default {
    state,
    mutations,
    getters
};
