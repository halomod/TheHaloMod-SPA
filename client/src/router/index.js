import Vue from 'vue';
import VueRouter from 'vue-router';
import {
  MdButton,
  MdContent,
  MdTabs,
  MdToolbar,
  MdAvatar,
  MdElevation,
  MdDrawer,
  MdList,
  MdApp,
} from 'vue-material/dist/components';
import VueObserveVisibility from 'vue-observe-visibility';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

import Home from '../views/Home.vue';

Vue.use(VueRouter);
Vue.use(VueObserveVisibility);
Vue.use(MdButton);
Vue.use(MdContent);
Vue.use(MdTabs);
Vue.use(MdToolbar);
Vue.use(MdAvatar);
Vue.use(MdElevation);
Vue.use(MdDrawer);
Vue.use(MdList);
Vue.use(MdApp);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/create',
    name: 'Create',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Create.vue'),
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior({ hash }, from, savedPosition) {
    if (hash) {
      try {
        document
          .getElementById(hash.slice(1))
          .scrollIntoView({
            behavior: 'smooth',
          });
        return {};
      } catch (err) {
        console.warn(err);
      }
    } if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});

export default router;
