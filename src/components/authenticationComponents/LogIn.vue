<template>
  <div class="form-container">
    <h2>{{ message }}</h2>
    <form>
      <div class="group">
        <label for="login-email">Email:</label>
        <input type="email" id="login-email" name="email" v-model="email" required />
      </div>
      <div class="group">
        <label for="login-password">Password:</label>
        <input type="password" id="login-password" name="password" v-model="password" required />
      </div>
      <div class="from-submit">
        <b-button variant="outline-success" @click="submit">Log In</b-button>
      </div>
    </form>
    <div class="error" v-if="getError">{{ getError }}</div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import { mapActions, mapGetters } from "vuex";
import { saveCurrentUser } from '@/services/user-getter.js';
export default {
  name: 'LogIn',
  props: {
    message: {
      type: String,
      required: false
    },
  },
  data() {
    return {
      email: '',
      password: '',
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getError'])
  },
  created() {
    this.setCurrentMail();
  },
  updated() {
    this.setCurrentMail();
  },
  methods: {
    ...mapActions(['logInAction']),
    async setCurrentMail() {
      let user;
      if (!this.email) user = await firebase.auth().currentUser;
      if (user) {
        this.email = user.email;
      }
    },
    async submit(event) {
      event.preventDefault();
      const currentUser = await firebase.auth().currentUser;
      if (currentUser && currentUser.email !== this.email) {
        this.$store.commit('setError', 'Logout from your current account');
      } else if (currentUser && currentUser.emailVerified) {
        this.$store.commit('setError', 'You are already logged in');
      } else {
        this.signInUser();
      }
    },
    signInUser() {
      this.loading = true;
      this.logInAction({ email: this.email, password: this.password });
      setTimeout(async () => {
        const user = await firebase.auth().currentUser;
        if (user) {
          saveCurrentUser(user);
          user.emailVerified ? this.$router.replace({ name: 'Lobby' }) : this.$emit('verify', 'Verify account');
        }
        this.loading = false;
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  form {
    .group {
      display: block;
      padding: 10px 0px;
      margin: 8px 0;
      text-align: left;
      label {
        width: 100%;
      }
      input {
        width: 99%;
        padding: 2px 2px;
        border: none;
        outline: none;
        font-size: 1em;
        border-bottom: 2px solid #42b983;
        &:focus {
          border-bottom: 3px solid #42b983;
        }
      }
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
          transition: background-color 5000s ease-in-out 0s;
      }
    }
    .from-submit {
      text-align: right;
    }
  }
  .error {
    // margin-top: 10px;
    color: red;
    font-size: 0.8em;
  }
}
</style>
