<template>
    <el-dialog
        title="忘记密码"
        :visible.sync="isOpenForget"
        width="400px"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        @open="open"
        @close="close"
        class="forgetDialog"
        top="0vh"
        center
    >
        <div class="login_dialog">
            <div class="head">
                <div class="logo">
                    <img src="../Layout/images/qjyc_logo.png" alt="" />
                </div>
                <div class="logo_text">
                    <span>云船码头（试用版）</span>
                </div>
            </div>
            <el-form
                ref="forgetForm"
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
                <el-form-item label="" prop="verifyCode" class="verifyCode">
                    <el-input
                        v-model="form.verifyCode"
                        placeholder="验证码"
                        maxlength="6"
                        type="text"
                    >
                        <el-button slot="append" @click="send">{{ buttonText }}</el-button>
                    </el-input>
                    <!-- <span></span> -->
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input
                        v-model="form.password"
                        placeholder="请输入密码"
                        type="password"
                    ></el-input>
                </el-form-item>
                <el-form-item class="login_btn">
                    <el-button type="primary" @click="submit">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
</template>

<script>
import { user, messageDetail } from "@/model/api";
import validate from "@/widget/validate";
import store from "@/widget/store";
import { mapState } from "vuex";

export default {
    data() {
        return {
            form: {
                mobile: "",
                password: "",
                verifyCode: ""
            },
            isClickCode: false,
            buttonText: "发送验证码",
            time: 60,
            rules: {
                mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }],
                verifyCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
            }
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
            isOpenForget: state => state.loginStore.isOpenForget
        })
    },
    methods: {
        open() {
            console.log("打开");
        },
        close() {
            this.$store.state.loginStore.isOpenForget = false;
            this.$store.commit("TOGGLE_LOGIN");
        },
        send() {
            const sendCode = () => {
                this.isClickCode = true;
                let times = this.time;
                this.buttonTextClone = this.buttonText;
                this.buttonText = times + "s";
                const countTimeTimer = setInterval(() => {
                    times--;
                    this.buttonText = times + "s";

                    if (times == 0) {
                        this.isClickCode = false;
                        this.buttonText = this.buttonTextClone;
                        clearInterval(countTimeTimer);
                    }
                }, 1000);
                this.countTimeTimer = countTimeTimer;
            };

            const { mobile } = this.form;
            if (!validate.isMobile(mobile)) {
                return this.$message.error("请输入正确的手机号");
            }
            if (this.isClickCode) {
                return false;
            }
            user({ type: "GET", data: { mobile } }, "verifyCode").then(res => {
                if (res.suceeded) {
                    sendCode();
                }
            });
        },
        submit() {
            const { mobile, verifyCode, password } = this.form;
            if (!validate.isMobile(mobile)) {
                return this.$message.error("请输入正确的手机号");
            }
            if (!verifyCode) {
                return this.$message.error("请输入验证码");
            }
            if (!password) {
                return this.$message.error("请输入密码");
            }
            this.$refs["forgetForm"].validate(valid => {
                if (valid) {
                    user(
                        { type: "POST", data: { mobile, password, verifyCode } },
                        "password/reset"
                    ).then(res => {
                        if (res.suceeded) {
                            this.$message.success("操作成功");
                            this.close();
                            this.$router.push({ path: "/" });
                        } else {
                            res.message && this.$message.error(res.message);
                        }
                    });
                }
            });
        }
    }
};
</script>

<style lang="less">
.forgetDialog {
    /deep/.el-dialog {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        height: 460px;
        border-radius: 4px;
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
                        margin: 20px 0px;
                        span {
                            font-size: 18px;
                            font-family: MicrosoftYaHei;
                            color: rgba(15, 79, 168, 1);
                            line-height: 36px;
                            -webkit-background-clip: text;
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
