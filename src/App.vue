<template>
  <div id="app">
    <div id="nav">
      <div class="greet" :key="username" v-if="isUserAuth">
        <router-link to="/profile" class="profile-link">Hello {{ getUser.displayName }}</router-link>
      </div>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/lobby">Lobby</router-link>
      <div class="logout">
        <LogOut />
      </div>
    </div>
    <h1 v-if="!isUserAuth">Welcome to Firechat</h1>
    <hr v-if="!isUserAuth">
    <router-view/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import LogOut from '@/components/authenticationComponents/LogOut.vue';
export default {
  components: {
    LogOut
  },
  data() {
    return {
      username: '',
      photoURL: ''
    }
  },
  mounted() {
    this.authAction();
    this.$events.$on('changedUsername', (data) => {
      this.username = data;
    });
    this.$events.$on('changedPhotoURL', (data) => {
      this.photoURL = data;
    });
  },
  computed: {
    ...mapGetters(['getUser', 'isUserAuth'])
  },
  methods: {
    ...mapActions(['authAction'])
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
