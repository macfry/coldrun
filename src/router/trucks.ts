import Index from '../views/trucks/Index.vue';
import Form from '../views/trucks/Form.vue';
import { RouteLocation, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: 'trucks',
    component: () => import('../views/layout/Children.vue'),
    children: [
      {
        path: '',
        name: 'trucks/index',
        component: Index,
        meta: {
          title: 'Truck Management',
          breadcrumbs: [
            {
              title: 'Truck Management',
            },
          ],
        },
      },
      {
        path: 'create',
        name: 'trucks/create',
        component: Form,
        meta: {
          mode: 'create',
          title: 'Create Truck',
          breadcrumbs: [
            {
              title: 'Truck Management',
              routeName: 'trucks/index',
            },
            {
              title: 'New Truck',
            },
          ],
        },
      },
      {
        path: ':id/edit',
        name: 'trucks/edit',
        component: Form,
        meta: {
          mode: 'edit',
          title: (route: RouteLocation): string => {
            return `Edit truck ${route.query.name || ''}`;
          },
          breadcrumbs: [
            {
              title: 'Truck Management',
              routeName: 'trucks/index',
            },
            {
              title: 'Edit Truck',
            },
          ],
        },
      },
    ],
  },
];

export default routes;
