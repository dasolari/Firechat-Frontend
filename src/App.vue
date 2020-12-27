<template>
  <div id="app">
    <div id="nav">
      <div class="greet" v-if="username">
        <router-link to="/profile" class="profile-link">Hello {{ username }}</router-link>
      </div>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/lobby">Lobby</router-link>
      <div class="logout">
        <LogOut />
      </div>
    </div>
    <h1 v-if="!username">Welcome to Firechat</h1>
    <hr v-if="!username">
    <router-view/>
  </div>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';
import LogOut from '@/components/LogOut.vue';
export default {
  components: {
    LogOut
  },
  data() {
    return {
      username: ''
    }
  },
  created() {
    this.setupFirebase();
  },
  updated() {
    this.setupFirebase();
  },
  methods: {
    setupFirebase() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        this.username = user.displayName;
      } else {
        firebase
          .default
          .auth()
          .onAuthStateChanged((user) => {
            if (user) {
              localStorage.setItem('user', JSON.stringify(user));
              this.username = user.displayName;
            }
        });
      }
    }
  }
}
</script>

<style lang='scss'>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 1.2em;
}

#nav {
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 2px 6px 9px -2px rgba(0,0,0,0.48);
  -webkit-box-shadow: 2px 6px 9px -2px rgba(0,0,0,0.48);
  -moz-box-shadow: 2px 6px 9px -2px rgba(0,0,0,0.48);
  .greet {
    position: absolute;
    left: 20px;
    top: 10px;
    padding: 10px;
    border-radius: 5px;
    transition: 150ms;
    box-shadow: -2px 1px 7px 3px rgba(0,0,0,0.32);
    &:hover {
      box-shadow: -2px 1px 10px 4px rgba(0,0,0,0.5);
      transition: 150ms;
    }
    .profile-link {
      width: 100%;
      padding: 10px;
      border-radius: 5px;
      &:hover {
        text-decoration: none;
      }
    }
  }
  a {
    font-weight: bold;
    color: #2c3e50;
  }
  a.router-link-exact-active {
    color: #42b983;
  }
  .logout {
    position: absolute;
    right: 20px;
    top: 15px;
  }
}
</style>
