const state = {
    blockIndex: 0,
    moduleIndex: 0,
    classIndex: -1,
    blockId: 0,
    moduleId: 0,
    classId: -1,
    userblock: {},
    platformblock: {},
    platformState: 1,
    platformClass: []
};

const mutations = {
    SET_USERBLOCK_INFO(state, { plylaod }) {
        state.userblock = plylaod;
    },
    SET_PLATFORMBLOCK_INFO(state, { plylaod }) {
        state.platformblock = plylaod;
    },
    SET_PLATFORMCLASS_INFO(state, { plylaod }) {
        state.platformClass = plylaod;
    },
    /*
    SETBLOCKINDEX(state, index) {
        state.blockIndex = parseInt(index);
        state.moduleIndex = 0;
        state.classIndex = -1;

        state.blockId =  state.userblock["blocks"][state.blockIndex]["id"];
        state.moduleId = state.userblock["blocks"][state.blockIndex]["moduleList"][state.moduleIndex]["id"];
        state.classId = -1;
    },
    SETMODULEINDEX(state, index) {
        state.moduleIndex = parseInt(index);
        state.classIndex = -1;

        state.moduleId = state.userblock["blocks"][state.blockIndex]["moduleList"][state.moduleIndex]["id"];
        state.classId = -1;
    },
    SETCLASSINDEX(state, index) {
        state.classIndex = parseInt(index);
        if(state.classIndex < 0) {
            state.classId=-1;
        }
        else {
            state.classId = state.userblock["blocks"][state.blockIndex]["moduleList"][state.moduleIndex]["classList"][state.classIndex]["id"];
        }
    },

     */
    SETBLOCKID(state, index) {

        state.blockId = index
        if(state.platformState == 0)
        {
            console.log("aa");
            for(var i=0; i<state.userblock["blocks"].length; i++) {
                if (state.userblock["blocks"][i]["id"] == state.blockId) {
                    state.moduleId=state.userblock["blocks"][i]["moduleList"][0]["id"];
                }
            }
        }
        else
        {
            console.log(111);
            console.log(state.platformblock[0]["id"])
            state.moduleId = state.platformblock[0]["id"];
        }
        state.classId = -1;
    },
    SETMODULEID(state, index) {
        state.moduleId = index;
        state.classId = -1;
    },
    SETCLASSID(state, index) {
        state.classId = index;
    },
    SETUSERSTATE(state){
        state.platformState=0;
    },
    SETPLATFORMSTATE(state){
        state.platformState=1;
    }

};

const getters ={
    getUserBlockResource(state)
    {
        return state.userblock["blocks"]
    },
    getUserModuleResource(state)
    {
        for(var i=0; i<state.userblock["blocks"].length; i++) {
            if (state.userblock["blocks"][i]["id"] == state.blockId) {
                return state.userblock["blocks"][i]["moduleList"]
            }
        }
    },
    getUserClassResource(state)
    {
        for(var i=0; i<state.userblock["blocks"].length; i++) {
            if (state.userblock["blocks"][i]["id"] == state.blockId) {
                for(var j=0; j<state.userblock["blocks"][i]["moduleList"].length; j++)
                {
                    if(state.userblock["blocks"][i]["moduleList"][j]["id"] == state.moduleId)
                    {
                        return state.userblock["blocks"][i]["moduleList"][j]["classList"]
                        console.log(state.userblock["blocks"][i]["moduleList"][j]["classList"]);
                    }
                }
            }
        }
    },
    getPlatformResource(state)
    {
        return state.platformblock
    },
    getBlockId(state)
    {
        return state.blockId
    },
    getModuleId(state)
    {
        return state.moduleId
    },
    getClassId(state)
    {
        return state.classId
    },
    getPlatformState(state)
    {
        return state.platformState
    },
    getPlatformClassList(state)
    {
        console.log("platformClass");
        console.log(state.platformClass);
        return state.platformClass
    }
};

export default {
    state,
    mutations,
    getters
};
