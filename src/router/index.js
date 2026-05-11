import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

const routes = [
    {
        path: '/',
        component: Dashboard
    },
    {
        path: '/login',
        component: () => import('../views/auth/Login.vue')
    },
    {
        path: '/forgot-password',
        component: () => import('../views/auth/ForgotPassword.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    const publicPages = ['/login', '/forgot-password']
    const authRequired = !publicPages.includes(to.path)

    if (authRequired && !token) {
        return next('/login')
    }

    if (to.path === '/login' && token) {
        return next('/')
    }

    next()
})

export default router