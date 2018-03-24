import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from './main.vue'

import './style.css'
Vue.use(VueRouter);

const routes = [
    {path: '/', component: Main},
];

const router = new VueRouter({
    mode: 'history',
    routes
});

new Vue({
    router,
    data: {
        routes: routes,
    },
    el: '#app',
});
