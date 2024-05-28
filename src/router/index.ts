import {
    createRouter,
    createWebHistory,
    RouteRecordRaw,
} from 'vue-router';
import Main from '../components/Main.vue';
import trucks from '../router/trucks';

const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      component: Main,
      children: [
        ...trucks,
      ],
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
  
export default router;