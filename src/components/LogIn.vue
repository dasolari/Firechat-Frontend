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
    <div class="error" v-if="error">{{ error.message }}</div>
  </div>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';
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
      error: ''
    }
  },
  created() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.email = user.email;
    }
  },
  methods: {
    async submit(event) {
      event.preventDefault();
      const anotherUser = await firebase.default.auth().currentUser;
      if (!anotherUser) {
        try {
          const { user } = await firebase.default.auth().signInWithEmailAndPassword(this.email, this.password);
          localStorage.setItem('user', JSON.stringify(user));
          console.log(user);
          if (user.emailVerified) {
            this.$router.replace({ name: 'Lobby' });
          } else {
            this.$emit('verify', 'Verify account');
          }
        } catch(err) {
          this.error = err;
          setTimeout(() => { this.error = ''; }, 8000);
        }
      } else {
        this.error = { message: 'Logout from your current account' };
        setTimeout(() => { this.error = ''; }, 8000);
      }
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