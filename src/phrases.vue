<template>
    <div id="content-container" class="content-container">
        <div class="flex-y-container">
            <h1>自定义提示语</h1>
            <div id="msg-warning" class="alert alert-warning" style="display: none;">
                <h4><i class="icon fa fa-exclamation"></i> 操作失败</h4>

                <p id="msg-warning-p">
                    {{ warning }}
                </p>
            </div>
            <div id="msg-error" class="alert alert-danger" style="display: none;">
                <h4><i class="icon fa fa-exclamation-triangle"></i> 发生错误</h4>

                <p id="msg-error-p">
                    {{ error }}
                </p>
            </div>
            <ul>
                <li v-for="(d, i) in data">
                    {{ d.phrase }}
                    <span class="right-icon"><a href="javascript:;" @click="trash(d.uuid, i)"><i class="fa fa-trash-alt"></i></a></span>
                </li>
                <li>
                    <input @focus="scrollTop" v-model="newPhrase" />
                    <span class="right-icon"><a href="javascript:;" @click="save"><i class="fa fa-save"></i></a></span>
                </li>
            </ul>
            <form>

            </form>
        </div>
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
                data: [],
                newPhrase: "",
                innerHeight: window.innerHeight
            }
        },
        computed: {
            user() {
                return this.auth.user
            },
            isLogin() {
                return this.auth.isLogin
            },
            isReady() {
                return this.auth.isReady
            },
        },
        mounted() {
            if (this.isReady && !this.isLogin) this.$router.push({path: "/login"});
            else if (this.isReady) this.getData();
            window.onresize = this.scrollTop;
        },
        watch: {
            isLogin() {
                if (!this.isLogin) this.$router.push({path: "/login"});
            },
            isReady() {
                if (!this.isLogin) this.$router.push({path: "/login"});
                else this.getData();
            }
        },
        methods: {
            scrollTop() {
                const e = document.getElementById('content-container');
                e.scrollTop = e.scrollHeight;
            },
            showWarning(msg) {
                this.warning = msg;
                $("#msg-error").hide(10);
                $("#msg-warning").hide(10).show(100);
            },
            showError(msg) {
                this.error = msg;
                $("#msg-warning").hide(10);
                $("#msg-error").show(100);
            },
            getData() {
                fetch(config.urlBase + '/phrases', {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Auth-Token': this.auth.token
                    }
                })
                    .then(res => {
                        res.json().then(
                            res => {
                                if (res.code === HttpStatus.OK) {
                                    this.data = res.data;
                                } else {
                                    switch (res.code) {
                                        case HttpStatus.UNAUTHORIZED:
                                            this.$emit('check-auth');
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
            trash(uuid, index) {
                if (confirm("确定要删除吗？")) {
                    this.remove(uuid, index);
                }
            },
            remove(uuid, index) {
                fetch(config.urlBase + `/phrases/${uuid}/delete`, {
                    method: "DELETE",
                    headers: {
                        'X-Auth-Token': this.auth.token
                    },
                })
                    .then(res => {
                        res.json().then(
                            res => {
                                if (res.code === HttpStatus.OK) {
                                    this.data.splice(index, 1);
                                } else {
                                    switch (res.code) {
                                        case HttpStatus.UNAUTHORIZED:
                                            this.$emit('check-auth');
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
            save() {
                fetch(config.urlBase + '/phrases/create', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Token': this.auth.token
                    },
                    body: this.newPhrase.trim()
                })
                    .then(res => {
                        res.json().then(
                            res => {
                                if (res.code === HttpStatus.OK) {
                                    this.data.push({uuid: res.data, phrase: this.newPhrase});
                                    this.newPhrase = "";
                                    $("#msg-error").hide(10);
                                    $("#msg-warning").hide(10);
                                } else {
                                    switch (res.code) {
                                        case HttpStatus.UNAUTHORIZED:
                                            this.$emit('check-auth');
                                            break;
                                        case HttpStatus.BAD_REQUEST:
                                            if (res.message === "the phrase should not be empty") {
                                                this.showWarning(`请填写提示语哦～`);
                                                break;
                                            }
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
        }
    }
</script>

<style scoped>

    h1 {
        color: #fff;
        font-family: Serif;
        margin: 2.8rem 0 1.68rem 0;
    }
    ul {
        list-style-type: none;
        padding: 0;
        max-width: 75%;
    }
    @media screen and (max-width: 760px) {
        ul {
            max-width: 90%;
        }
    }
    li {
        position: relative;
        background-color: #fff;
        margin-top: 10px;
        margin-bottom: 10px;
        font-size: 15px;
        line-height: 19px;
        padding: 0.25em 1em;
        color: #6a737d;
        border-left: 0.25em solid #ffaa7f;
        text-align: left;
        word-break: break-all;
        margin-right: 40px;
    }
    li span.right-icon {
        position: absolute;
        padding: 0 0.75em;
        left: calc(100% + 10px);
        display: block;
        top: 0;
        height: 100%;
        color: #6a737d;
        background-color: #fff;
        white-space: nowrap;
        line-height: 100%;
        text-align: center;
    }
    li span.right-icon a {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        transform: translate(0, -50%);
    }
    li input {
        width: 100%;
        line-height: calc(100% - 0.5rem);
        margin: 0.25rem 0;
    }
    a {
        font-size: 16px;
        font-family: Serif;
        color: #6a737d;
        text-decoration: none;
    }

</style>