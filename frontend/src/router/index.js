import { createRouter, createWebHistory } from "vue-router";
import adminRoutes from "./admin.route";
import clientRoutes from './client.route'

const routes = [
    ...adminRoutes,
    ...clientRoutes,
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router