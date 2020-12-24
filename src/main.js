import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue';
import './plugins/bootstrap-vue'
import App from './App.vue';
import router from './router';
import axios from 'axios';
import firebase from 'firebase/app';

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: "AIzaSyAP0IQFzk_JbijyXFWAEb8ct6qa6xxKTvg",
  authDomain: "firechat-ac1af.firebaseapp.com",
  projectId: "firechat-ac1af",
  storageBucket: "firechat-ac1af.appspot.com",
  messagingSenderId: "76796436814",
  appId: "1:76796436814:web:15df939e4abdac4d5a3e1f",
  measurementId: "G-5R5VZ88BRR"
};

firebase.initializeApp(firebaseConfig);
// firebase.analytics();

let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app');
  }
});
