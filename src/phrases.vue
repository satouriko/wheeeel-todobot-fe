<template>
    <div class="content-container">
        <div class="flex-y-container">
            <h1>自定义提示语</h1>

            <textarea v-if="editing" class="form-control" @input="resizeTextarea"></textarea>
            <ul>
                <li v-for="d in data">{{ d.phrase }}</li>
                <li v-if="!editing"><a href="javascript:;" @click="edit"><i class="fa fa-pencil-alt"></i> 编辑</a> </li>
                <li v-else><a href="javascript:;" @click="update"><i class="fa fa-save"></i> 保存</a> </li>
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
                jsonData: "",
                data: [],
                editing: false
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
            }
        },
        mounted() {
            if (this.isReady && !this.isLogin) this.$router.push({path: "/login"});
            this.getData();
        },
        watch: {
            isLogin() {
                if (!this.isLogin) this.$router.push({path: "/login"});
            },
            isReady() {
                if (!this.isLogin) this.$router.push({path: "/login"});
            }
        },
        methods: {
            edit() {
                this.editing = true;
            },
            update() {
                this.editing = false;
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
                                    this.jsonData = JSON.stringify(res.data);
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
            resizeTextarea(e) {
                const minRows = 5;
                // 最大高度，超过则出现滚动条
                const maxRows = Infinity;
                let t = e.target;
                if (t.scrollTop === 0) t.scrollTop=1;
                while (t.scrollTop === 0){
                    if (t.rows > minRows)
                        t.rows--;
                    else
                        break;
                    t.scrollTop = 1;
                    if (t.rows < maxRows)
                        t.style.overflowY = "hidden";
                    if (t.scrollTop > 0){
                        t.rows++;
                        break;
                    }
                }
                while(t.scrollTop > 0){
                    if (t.rows < maxRows){
                        t.rows++;
                        if (t.scrollTop === 0) t.scrollTop=1;
                    }
                    else{
                        t.style.overflowY = "auto";
                        break;
                    }
                }
            }
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
    li {
        background-color: #fff;
        margin: 10px 0px;
        font-size: 20px;
        padding: 0 1em;
        color: #6a737d;
        border-left: 0.25em solid #ffaa7f;
        text-align: left;
        word-break: break-all;
    }
    textarea {
        max-width: 75%;
        border-radius: 0;
        overflow: hidden;
    }
    a {
        font-size: 16px;
        font-family: Serif;
        color: #6a737d;
        text-decoration: none;
    }

</style>