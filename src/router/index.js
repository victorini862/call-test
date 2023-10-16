import { createRouter, createWebHistory } from 'vue-router'

function configRoutes() {
    return [
        {
            path: '/',
            name: 'Home',
            component: () => import('../views/HomeView.vue'),
        },
        {
            path: '/sipjs',
            name: 'SIPjs',
            component: () => import('../views/SiPjs.vue'),
        },
        {
            path: '/jssip',
            name: 'jsSIP',
            component: () => import('../views/JsSIP.vue'),
        },
    ]
}

export default new createRouter({
    history: createWebHistory(),
    routes: configRoutes()
})