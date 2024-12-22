import { createRouter, createWebHistory } from 'vue-router'
import LoginUser from '@/components/Account/LoginUser.vue'

const routes = [
    {
        path: '/login',
        name: 'LoginUser',
        component: LoginUser
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router