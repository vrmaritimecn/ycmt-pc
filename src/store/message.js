const state = {
    isOpenMessage:false,
    isOpenSceneThumb:false,
    messageList:[],
    projectId:-1,
    projectData:[],
    sceneList:[],
    hotspotList:[],
    sceneTypeList:[],
    sceneAllList:[],
    isOpenOrg:false
};

const mutations = {
    RESETMESSSAGE(state, plylaod) {
        state.messageList=[];
    },
    ADDMESSSAGE(state, plylaod) {
        state.messageList.push(plylaod);
        console.log(state.messageList);
    },
    SETPROJECTID(state,index){
        state.projectId=index
    },
    SET_PROJECT_DATA(state, plylaod) {
        state.projectData=plylaod
    },
    SET_SCENELIST(state, plylaod) {
        state.sceneList=plylaod
    },
    SET_HOTSPOTLIST(state, plylaod) {
        state.hotspotList=plylaod
    },
    SETISOPENMESSAGE(state){
        state.isOpenMessage=!state.isOpenMessage
    },
    RESETISOPENMESSAGE(state){
        state.isOpenMessage=false;
    },
    SET_SCENETYPELIST(state, plylaod) {
        state.sceneTypeList=plylaod
    },
    SET_SCENEALLLIST(state, plylaod) {
        state.sceneAllList=plylaod
    },
    ISOPENORG(state) {
        state.isOpenOrg=true;
    },
    ISCLOSEORG(state) {
        state.isOpenOrg=false;
        console.log(state.isOpenOrg)
    },
    TOGGLESCENETHUMB(state){
        state.isOpenSceneThumb=!state.isOpenSceneThumb
        console.log("isOpenSceneThumb");
    }
};

const getters ={
    getIsOpenSceneThumb(state){
        return state.isOpenSceneThumb
    },
    getMessageList(state){
        return state.messageList
    },
    getProjectId(state){
        return state.projectId
    },
    getProjectData(state){
        return state.projectData
    },
    getSceneList(state){
        return state.sceneList
    },
    getHotspotList(state){
        return state.hotspotList
    },
    getIsOpenMessage(state) {
        return state.isOpenMessage
    },
    getSceneTypeList(){
        return state.sceneTypeList
    },
    getSceneAllList(){
        return state.sceneAllList
    },
    getIsOpenOrg(){
        return state.isOpenOrg
    }
};

export default {
    state,
    mutations,
    getters
};
