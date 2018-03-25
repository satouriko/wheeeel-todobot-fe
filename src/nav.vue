<template>
    <div>
        <div :class="`background bg ${$route.name}`"></div>
        <ul>
            <li v-for="route in routes" :style="displayStyle(route.name)">
                <a :class="route.name" href="javascript:;" :title="route.title" @click="$router.push(route.path)">
                    <i :class="`fa fa-${route.name}`"></i>
                </a>
            </li>
        </ul>
        <!--Preloader-->
        <div>
            <div class="bg chart-bar"></div>
            <div class="bg chart-line"></div>
            <div class="bg chart-pie"></div>
            <div class="bg user"></div>
        </div>
    </div>
</template>

<script>

    export default {
        props: [
            'routes',
            'auth'
        ],
        methods: {
            displayStyle(name) {
                if (this.display(name))
                    return 'display: block';
                else
                    return 'display: none !important';
            },
            display(name) {
                switch (name) {
                    case 'user':
                        return !this.auth.isLogin;
                    case 'boxes':
                        return this.auth.isLogin;
                    default:
                        return !!name;
                }
            }
        }
    }
</script>

<style scoped>

    .chart-bar:hover {
        color: #ff299b !important;
    }

    .chart-line:hover {
        color: #13b4ff !important;
    }

    .chart-pie:hover {
        color: #c668c6 !important;
    }

    .user:hover,.boxes:hover {
        color: #b8ff1e !important;
    }

    .bg.chart-bar {
        background: url("img/bg1.jpg");
    }

    .bg.chart-line {
        background: url("img/bg4.jpg");
    }

    .bg.chart-pie {
        background: url("img/bg2.jpg");
    }

    .bg.user,.bg.boxes {
        background: url("img/bg3.jpg");
    }

    .background {
        -webkit-background-size: cover;
        background-size: cover;
        -webkit-filter: blur(5px);
        -moz-filter: blur(5px);
        -o-filter: blur(5px);
        -ms-filter: blur(5px);
        filter: blur(5px);
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: -2;
        -webkit-transform: scale(1.1);
        -ms-transform: scale(1.1);
        transform: scale(1.1);
        -webkit-transition: 0.5s all ease-in;
        -o-transition: 0.5s all ease-in;
        transition: 0.5s all ease-in;
    }

    @media screen and (max-width: 760px) {
        ul {
            width: 100% !important;
            height: 80px !important;
            line-height: 50px !important;
            top: calc(100% - 110px) !important;
            bottom: 0px !important;
            -webkit-transform: translateY(0px) !important;
            -ms-transform: translateY(0px) !important;
            transform: translateY(0px) !important;
        }
        li {
            display: inline-block !important;
            margin: 0px 20px !important;
        }
    }

    ul {
        width: 60px;
        position: fixed;
        left: 0px;
        padding: 30px;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        z-index: 10;
        text-align: center;
        font-family: 'STHeiti', 'Microsoft YaHei', 'Ping Fang', 'WenQuanYi Micro Hei';
    }

    li,li a {
        color: #fff;
        text-decoration: none;
        font-size: 1.5rem;
        margin: 20px 0px;
        display: block;
        -webkit-transition: 0.3s all ease-in-out;
        -o-transition: 0.3s all ease-in-out;
        transition: 0.3s all ease-in-out;
    }
</style>
