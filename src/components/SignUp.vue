<template>
  <div class="form-container">
    <h2>{{ message }}</h2>
    <form>
      <b-overlay :show="loading" no-wrap></b-overlay>
      <div class="group">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" maxLength="25" v-model="username" required />
      </div>
      <div class="group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" v-model="email" required />
        <p class="warning-alert abs" v-if="invalidEmail">This must be an email</p>
      </div>
      <div class="group">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" v-model="password" required />
        <p class="warning-alert" v-if="invalidPasswordLength">Password must be greater than 7 characters</p>
        <p class="warning-alert" v-if="invalidPasswordUppercase">Password must have at least 1 uppercase character</p>
        <p class="warning-alert" v-if="invalidPasswordNumber">Password must have at least 1 number</p>
      </div>
      <div class="group">
        <label for="confirm-password">Confirm Password:</label>
        <input type="password" id="confirm-password" name="confirm-password" v-model="confirmPassword" required />
        <p class="warning-alert abs" v-if="invalidConfirmPassword">Passwords don't match</p>
      </div>
      <div class="from-submit">
        <p id="submit-warning-alert">Fix your current fields</p>
        <b-button variant="outline-success" @click="submit">Sign Up</b-button>
      </div>
    </form>
    <div class="error" v-if="getError">{{ getError }}</div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import { mapActions, mapGetters } from "vuex";
import { saveCurrentUser } from '@/services/user-getter.js';
const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const pu = /[A-Z]/;
const pn = /\d/;
export default {
  name: 'SignUp',
  props: {
    message: {
      type: String,
      required: false
    },
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getError']),
    invalidEmail() {
      return this.email && !(re.test(this.email));
    },
    invalidPasswordLength() {
      return this.password && this.password.length < 8;
    },
    invalidPasswordUppercase() {
      return this.password && !(pu.test(this.password));
    },
    invalidPasswordNumber() {
      return this.password && !(pn.test(this.password));
    },
    invalidConfirmPassword() {
      return this.confirmPassword && !(this.confirmPassword === this.password);
    }
  },
  methods: {
    ...mapActions(['signUpAction']),
    async submit(event) {
      event.preventDefault();
      if (!this.validate()) {
        const submitAlert = document.getElementById('submit-warning-alert');
        submitAlert.style.display = 'inline';
        setTimeout(() => { submitAlert.style.display = 'none'; }, 3000);
      } else {
        const currentUser = await firebase.auth().currentUser;
        if (currentUser) {
          this.$store.commit('setError', 'Logout from your current account');
          return
        }
        this.saveUser();
      }
    },
    saveUser() {
      this.loading = true;
      this.signUpAction({ email: this.email, password: this.password });
      setTimeout(async () => {
        const user = await firebase.auth().currentUser;
        if (user) {
          saveCurrentUser(user);
          await user.updateProfile({ displayName: this.username });
          await user.sendEmailVerification();
          this.$emit('created', 'Sent email');
        }
        this.loading = false;
      }, 1000);
    },
    validate() {
      const E = re.test(this.email);
      const PL = this.password.length >= 8;
      const PU = pu.test(this.password);
      const PN = pn.test(this.password);
      const CP = this.password === this.confirmPassword;
      return this.username && E && PL && PU && PN && CP;
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
      .warning-alert {
        color: red;
        margin: 0;
        font-size: 0.8em;
      }
      .abs {
        position: absolute;
      }
    }
    .from-submit {
      text-align: right;
      position: relative;
      #submit-warning-alert {
        position: absolute;
        color: red;
        top: 8px;
        right: 90px;
        font-size: 0.8em;
        display: none;
      }
    }
  }
  .error {
    // margin-top: 10px;
    color: red;
    font-size: 0.8em;
  }
}
</style>
