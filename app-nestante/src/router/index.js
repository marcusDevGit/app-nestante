import { createRouter, createWebHistory } from 'vue-router'
import LoginUser from '@/components/Account/LoginUser.vue'
import RegisterUser from '@/components/Account/RegisterUser.vue';
import RecoverPassword from '@/components/Account/RecoverPassword.vue';
import TaskManager from '@/components/Tasks/TaskManager.vue';

const routes = [
    {
        path: '/week',
        name: 'Week',
        component: TaskManager
    },
    {
        path: '/login',
        name: 'LoginUser',
        component: LoginUser
    },
    {
        path: '/register',
        name: 'RegisterUser',
        component: RegisterUser
    },
    {
        path: '/recover-password',
        name: 'RecoverPassword',
        component: RecoverPassword
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router