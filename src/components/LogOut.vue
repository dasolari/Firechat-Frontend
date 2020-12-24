<template>
  <b-button v-if="loggedIn" variant="outline-danger" @click="signOut">Logout</b-button>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'LogOut',
  data() {
    return {
      loggedIn: false
    }
  },
  mounted() {
    this.setupFirebase();
  },
  methods: {
    async signOut() {
      try {
        await firebase.default.auth().signOut();
        localStorage.removeItem('user');
        window.location = '/';
      } catch(err) {
        console.log(err);
      }
    },
    setupFirebase() {
      firebase
        .default
        .auth()
        .onAuthStateChanged((user) => {
          if (user) {
            this.loggedIn = true;
          } else {
            this.loggedIn = false;
          }
        });
    }
  }
}
</script>
