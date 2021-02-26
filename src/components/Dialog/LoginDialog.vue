<template>
    <el-dialog
        title="登 录"
        :visible.sync="isOpenLoggin"
        width="400px"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :show-close="false"
        @open="open"
        @closed="close"
        class="loginDialog"
        top="0vh"
        center
    >
        <div v-loading="loading" class="login_dialog">
            <div class="head">
                <div class="logo">
                    <img src="../Layout/images/qjyc_logo.png" alt="" />
                </div>
                <div class="logo_text">
                    <span>云船码头（试用版）</span>
                </div>
            </div>
            <el-form
                ref="loginForm"
                :model="form"
                :rules="rules"
                label-position="left"
                label-width="0px"
            >
                <el-form-item label="" prop="mobile">
                    <el-input
                        v-model="form.mobile"
                        maxlength="11"
                        placeholder="请输入手机号"
                    ></el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input
                        v-model="form.password"
                        placeholder="请输入密码"
                        type="password"
                    ></el-input>
                </el-form-item>
                <el-form-item label="" prop="" class="forget">
                    <span @click="forget">忘记密码</span>
                </el-form-item>
                <el-form-item class="login_btn">
                    <el-button type="primary" @click="submit">登 录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
</template>

<script>
import { appConst, user, messageDetail, block, projectModule } from "@/model/api";
import validate from "@/widget/validate";
import store from "@/widget/store";
import { mapState } from "vuex";

export default {
    data() {
        return {
            form: {
                mobile: "",
                password: ""
            },
            rules: {
                mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }]
            },
            loading: false
        };
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState({
            isOpenLoggin: state => state.loginStore.isOpenLogin
        })
    },
    methods: {
        open() {
            console.log("打开");
        },
        close() {
            this.$store.state.loginStore.isOpenLogin = false;
        },
        forget() {
            this.close();
            this.$store.commit("TOGGLE_FORGET");
        },
        submit() {
            if (!validate.isMobile(this.form.mobile)) {
                return this.$message.error("请输入正确的手机号");
            }
            const { mobile, password } = this.form;
            this.$refs["loginForm"].validate(valid => {
                if (valid) {
                    user({ type: "POST", data: { mobile, password } }, "login").then(res => {
                        if (res.suceeded) {
                            const {
                                suceeded,
                                data: { authorization, id }
                            } = res;

                            store.set("authorization", authorization, "local");
                            store.set("userId", id, "local");
                            store.set("user", res.data, "local");
                            this.$store.commit("TOGGLE_LOGIN");
                            this.$message.success("登录成功");
                            this.getUserDetail();
                            window.location.href = "/";
                        } else {
                            res.message && this.$message.error(res.message);
                        }
                    });
                }
            });
        },
        getUserDetail() {
            this.$nextTick(() => {
                const userId = store.get("userId", "local");
                user(
                    {
                        type: "get"
                    },
                    "/personal"
                ).then(res => {
                    if (res.suceeded) {
                        this.$store.commit("SET_USERID", res.data.id);
                        this.$store.commit({
                            type: "SET_USERBLOCKLIST_INFO",
                            plylaod: res.data["blocks"]
                        });

                        this.$store.commit({
                            type: "SET_USERBLOCK_INFO",
                            plylaod: res.data
                        });

                        this.$store.commit({
                            type: "SET_USER_INFO",
                            plylaod: res.data
                        });
                        this.user = res.data;
                        this.getMessageDetail();
                        this.getPlatformEnterprise();
                        if(res.data.userType==0 || res.data.userType==1)
                        {
                            this.getEnterpriseConst(res.data.enterprises[0]["id"]);
                        }else if(res.data.userType==2){
                            this.getEnterpriseConst(-1);
                        }else{
                         this.$message({
                             message:"登陆出错，请刷新网页重新登录",
                             type:"error"
                         })
                        }
                    }
                });
            });
        },
        getEnterpriseConst(val){
            appConst({
                type: "get",
                data: {
                    name: "APP_DEFAULT_ENTERPRISE_DETAIL"
                }
            }).then(res => {
                if (res.suceeded) {
                    var str = [];
                    var eId = null;
                    for (var i = 0; i < res.data.length; i++) {
                        str.push(JSON.parse(res.data[i].value));
                    }
                    if(val!=-1) {
                        for (var i = 0; i < str.data.length; i++){
                            if(str[i]["id"]==val){
                                this.$store.commit("SETENTERPRISEID",str[i]["id"]);
                                this.$store.commit("SETDEPARTMENTID",str[i]["departmentId"]);
                            }
                        }
                    }else{
                        this.$store.commit("SETENTERPRISEID",str[0]["id"]);
                        this.$store.commit("SETDEPARTMENTID",str[0]["departmentId"]);
                    }
                }
            });
        },
        getPlatformEnterprise(){
            appConst({
                type: "get",
                data: {
                    name: "APP_PLATFORM_ENTERPRISE"
                }
            }).then(res => {
                if (res.suceeded) {
                    this.getPlatformBlockList(res.data[0]["value"]);
                }
            });
        },
        getPlatformBlockList(val){
            block({
                type: "get",
                data: {
                    enterpriseId: val
                }
            }).then(res => {
                if (res.suceeded) {
                    this.getPlatformBlockModuleList(res.data.content[0]["id"]);
                    this.$store.commit("SETBLOCKID",res.data.content[0]["id"]);
                    this.$store.commit('SET_PLATFORMBLOCKLIST_INFO',res.data.content);
                }
                else{
                    this.$message({
                        message:"未获取到平台信息"
                    });
                }
            });
        },
        getPlatformBlockModuleList(val){
            projectModule({
                type: "get",
                data: {
                    blockId: val
                }
            }).then(res => {
                if (res.suceeded) {
                    this.$store.commit("SETMODULEID",res.data[0]["id"]);
                }
            });
        },
        getMessageDetail() {
            messageDetail(
                {
                    type: "get"
                },
                "unreadCount"
            ).then(res => {
                if (res.suceeded) {
                    const { count } = res.data;
                    this.count = count;
                }
            });
        }
    }
};
</script>

<style lang="less">
.loginDialog {
    /deep/.el-dialog {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        height: 405px;
        border-radius: 2px;
        .el-dialog__body {
            // height: 350px;
            padding: 20px 20px !important;
            .login_dialog {
                .head {
                    width: 100%;
                    .logo {
                        // width: 82px;
                        height: 66px;
                        max-width: 100%;
                        margin: 0 auto;
                        display: flex;
                        justify-content: center;
                        img {
                            width: 100;
                            height: 100%;
                            max-width: 100%;
                        }
                    }
                    .logo_text {
                        width: 100%;
                        text-align: center;
                        margin: 10px 0px;
                        span {
                            font-size: 18px;
                            font-family: MicrosoftYaHei;
                            color: rgba(15, 79, 168, 1);
                            line-height: 36px;
                            -webkit-background-clip: text;
                        }
                    }
                }
                .forget {
                    line-height: 12px !important;
                    text-align: right;
                    margin: 12px 0px;

                    .el-form-item__content {
                        line-height: 14px;
                        span {
                            cursor: pointer;
                        }
                    }
                }
                .login_btn {
                    button {
                        width: 100%;
                        background-color: #324155;
                    }
                }
            }
        }
        .el-dialog__header {
            border-bottom: 1px solid #eee;
        }
    }
}
</style>
