import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Profile from '../views/Profile.vue';
import Lobby from '../views/Lobby.vue';
import * as firebase from 'firebase/app';
import 'firebase/auth';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/lobby',
    name: 'Lobby',
    component: Lobby,
    meta: { requiresAuth: true }
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = firebase.default.auth().currentUser;
  if (requiresAuth && (!isAuthenticated || !isAuthenticated.emailVerified)) {
    if (!localStorage.getItem('alert')) {
      localStorage.setItem('alert', 'To access these features, log in to your account or create one');
    }
    if (router.history.current.name === 'Home') {
      window.location = '/';
    } else {
      next('/');
    }
  } else {
    next();
  }
});

export default router;
