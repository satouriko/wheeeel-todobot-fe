<template>
    <!-- Main content -->
    <div class="container">
        <div class="row">
            <!-- left column -->
            <h2>用户登录</h2>
            <div class="col-md-12">
                <div id="msg-success" class="alert alert-success" style="display: none;">
                    <h4><i class="icon fa fa-info"></i> 登录成功，欢迎回来！</h4>
                    <p id="msg-success-p">{{ loginMessage }}</p>
                </div>
                <div id="msg-warning" class="alert alert-warning" style="display: none;">
                    <h4><i class="icon fa fa-info"></i> 登录失败！</h4>

                    <p id="msg-warning-p">
                        {{ warning }}
                    </p>
                </div>
                <div id="msg-error" class="alert alert-danger" style="display: none;">
                    <h4><i class="icon fa fa-info"></i> 发生错误！</h4>

                    <p id="msg-error-p">
                        {{ error }}
                    </p>
                </div>
            </div>
            <div class="col-md-6" v-if="isReady && !isLogin">
                <!-- general form elements -->
                <div class="box box-primary">
                    <div class="box-body">
                        <div class="form-horizontal">
                            <div class="row">
                                <fieldset class="col-sm-12">
                                    <div class="form-group" v-if="otp">
                                        <label for="otp" class="col-sm-3 control-label">验证码</label>

                                        <div class="col-sm-9">
                                            <p id="otp">{{ otpCode }}</p>
                                        </div>
                                    </div>
                                    <div class="form-group" v-else-if="!warning">
                                        <p>正在登录...请稍候</p>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.box -->
            </div>
        </div>
        <!-- /.row -->
    </div>
</template>

<script>
    import config from './config'
    import urlParam from './buildUrlParam'
    import HttpStatus from 'http-status-codes'
    export default {
        props: [
            "auth"
        ],
        data() {
            return {
                error: "",
                warning: "",
                otp: false,
                otpCode: "",
                otpLoop: null,
            }
        },
        computed: {
            user() {
                return this.auth.user
            },
            isLogin() {
                return this.auth.isLogin
            },
            loginMessage() {
                return `你好，${this.user.disp_name}！`;
            },
            isReady() {
                return this.auth.isReady
            }
        },
        mounted() {
            if(this.isReady) {
                if(this.isLogin) {
                    this.onLogin()
                } else if(typeof this.$route.query.cred !== 'undefined') {
                    this.credLogin(this.$route.query.cred)
                } else {
                    this.otp = true;
                    this.initOtp();
                }
            }
        },
        beforeDestroy() {
            clearInterval(this.otpLoop);
        },
        watch: {
            isLogin(newV, oldV) {
                if (newV && !oldV) {
                    this.onLogin()
                } else if(!newV && oldV) {
                    this.onLogout()
                }
            },
            isReady() {
                if(this.isLogin) {
                    //
                } else if(typeof this.$route.query.cred !== 'undefined') {
                    this.credLogin(this.$route.query.cred)
                } else {
                    this.otp = true;
                    this.initOtp();
                }
            }
        },
        methods: {
            onLogin() {
                $("#msg-success").hide(10).show(100);
                setTimeout(() => {
                    this.$router.push({path: "/"});
                }, 3000);
            },
            onLogout() {
                $("#msg-success").hide(10);
            },
            showWarning(msg) {
                this.warning = msg;
                $("#msg-success").hide(10);
                $("#msg-error").hide(10);
                $("#msg-warning").hide(10).show(100);
            },
            showError(msg) {
                this.error = msg;
                $("#msg-success").hide(10);
                $("#msg-warning").hide(10);
                $("#msg-error").show(100);
            },
            initOtp() {
                this.requestOtp();
                this.otpLoop = setInterval(this.requestOtp, 60000);
                this.otpLogin();
            },
            requestOtp() {
                fetch(config.urlBase + '/login/otp', {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                    .then(res => {
                        res.json().then(
                            res => {
                                if (res.code === HttpStatus.OK) {
                                    this.otpCode = res.data
                                } else {
                                    switch (res.message) {
                                        default:
                                            this.showWarning(`发生错误：${res.message}`);
                                    }
                                }
                            }
                        ).catch(error => {
                            this.showError(`网络错误：${error}`);
                        });
                    })
                    .catch(error => {
                        this.showError(`网络错误：${error}`);
                    });
            },
            credLogin(cred) {
                fetch(config.urlBase + '/login?' + urlParam({
                    cred: cred
                }), {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                    .then(res => {
                        let token = res.headers.get("X-Auth-Token");
                        res.json().then(
                            res => {
                                if (res.code === HttpStatus.OK) {
                                    let auth = {
                                        isLogin: true,
                                        token: token,
                                        user: res.data
                                    };
                                    this.$emit('update-auth', auth);
                                } else {
                                    switch (res.message) {
                                        case "token expired or invalid, please try again":
                                            this.showWarning("链接无效或已过期，请重新生成登录链接。" );
                                            break;
                                        default:
                                            this.showWarning(`发生错误：${res.message}`);
                                    }
                                }
                            }
                        ).catch(error => {
                            this.showError(`网络错误：${error}`);
                        });
                    })
                    .catch(error => {
                        this.showError(`网络错误：${error}`);
                    });
            },
            otpLogin() {
                fetch(config.urlBase + '/login?' + urlParam({
                    otp: this.otpCode
                }), {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                    .then(res => {
                        res.json().then(
                            res => {
                                if (res.code === HttpStatus.OK) {
                                    let auth = {
                                        isLogin: true,
                                        token: token,
                                        user: res.data
                                    };
                                    this.$emit('update-auth', auth);
                                } else {
                                    if(!this._isBeingDestroyed) setTimeout(this.otpLogin, 3000);
                                    /*switch (res.message) {
                                        case "token expired or invalid, please try again":
                                            this.showError("链接无效或已过期，请重新生成登录链接。" );
                                            break;
                                        default:
                                            this.showError(`发生错误：${res.message}`);
                                    }*/
                                }
                            }
                        ).catch(error => {
                            this.showError(`网络错误：${error}`);
                            if(!this._isBeingDestroyed) setTimeout(this.otpLogin, 3000);
                        });
                    })
                    .catch(error => {
                        this.showError(`网络错误：${error}`);
                        if(!this._isBeingDestroyed) setTimeout(this.otpLogin, 3000);
                    });
            },
            checkStatus() {
                this.$emit('check-auth')
            },
            logout() {

            }
        }
    }
</script>

<style scoped>

</style>