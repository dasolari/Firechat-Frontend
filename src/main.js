import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue';
import VueEvents from 'vue-events';
import VueChatScroll from 'vue-chat-scroll';
import WebRTC from 'vue-webrtc';
import './plugins/bootstrap-vue'
import App from './App.vue';
import router from './router';
import axios from 'axios';
import firebase from 'firebase/app';
import store from './store';
import * as io from 'socket.io-client';


Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.use(VueEvents);
Vue.use(VueChatScroll);
Vue.use(WebRTC);
window.io = io;

// Initialize firebase
import db from "@/plugins/firebase";

store.state.db = db;

let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      store,
      router,
      render: h => h(App)
    }).$mount('#app');
  }
});
