import Vue from 'vue'
import VueRouter from 'vue-router'
import HttpStatus from 'http-status-codes'
import Cookies from 'js-cookie'

import config from './config'

import Main from './main.vue'
import Login from './login.vue'
import Nav from './nav.vue'

import './style.css'
Vue.use(VueRouter);

const routes = [
    {title: '排行榜', name: 'chart-bar', path: '/', component: Main},
    {title: '趋势', name: 'chart-line', path: '/trend', component: Main},
    {title: '登录', name: 'user', path: '/login', component: Login},
];

const router = new VueRouter({
    mode: 'history',
    routes
});

new Vue({
    router,
    data: {
        routes: routes,
        auth: {
            isReady: false,
            isLogin: false,
            token: "",
            user: {
                user_name: "",
                disp_name: "",
                id: "",
                uuid: "",
            }
        }
    },
    el: '#app',
    watch: {
        auth() {
            Cookies.set('auth-token', this.auth.token, { expires: 365 });
        }
    },
    mounted() {
        this.auth.token = Cookies.get('auth-token');
        this.checkAuth();
    },
    methods: {
        checkAuth() {
            fetch(config.urlBase + '/getMe', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Auth-Token': this.auth.token
                }
            })
                .then(res => {
                    this.auth.token = res.headers.get("X-Auth-Token");
                    res.json().then(
                        res => {
                            if (res.code === HttpStatus.OK) {
                                this.auth.user = res.data;
                                this.auth.isLogin = true;

                            } else {
                                this.auth.isLogin = false;
                            }
                            this.auth.isReady = true;
                            console.log(this.auth)
                        }
                    )
                });
        },
        updateAuthStatus(auth) {
            this.auth = auth;
        },
    },
    components: {
        'nav-section': Nav
    }
});
