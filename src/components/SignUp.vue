<template>
  <div>
    <h1>{{ message }}</h1>
    <form>
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" maxLength="25" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" v-model="email" required />
        <p class="alert" v-if="emailErrors['format']">{{ emailErrors['format'] }}</p>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" v-model="password" required />
        <p class="alert" v-if="passwordErrors['len']">{{ passwordErrors['len'] }}</p>
        <p class="alert" v-if="passwordErrors['upper']">{{ passwordErrors['upper'] }}</p>
        <p class="alert" v-if="passwordErrors['number']">{{ passwordErrors['number'] }}</p>
      </div>
      <div class="form-group">
        <label for="confirm-password">Confirm Password:</label>
        <input type="password" id="confirm-password" name="confirm-password" v-model="confirmPassword" required />
        <p class="alert" v-if="confPasswordErrors['equals']">{{ confPasswordErrors['equals'] }}</p>
      </div>
      <div class="from-submit">
        <button @click="submit" :disabled="!(username && email && password && password === confirmPassword)">Sign Up</button>
      </div>
    </form>
  </div>
</template>

<script>
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
      emailErrors: [],
      passwordErrors: [],
      confPasswordErrors: []
    }
  },
  watch: {
    email(value) {
      this.validateEmail(value);
    },
    password(value) {
      this.validatePassword(value);
    },
    confirmPassword(value) {
      this.validateConfirmPassword(value);
    }
  },
  methods: {
    async submit(event) {
      event.preventDefault();
      console.log('Form submitted');
      console.log({ username: this.username, email: this.email, password: this.password });
    },
    validateEmail(value) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (value) {
        re.test(value) ? this.emailErrors['format'] = '' : this.emailErrors['format'] = 'This must be an email';
      } else {
        this.emailErrors = [];
      }
    },
    validatePassword(value) {
      if (value) {
        this.password.length >= 8 ? this.passwordErrors['len'] = '' : this.passwordErrors['len'] = 'Password must be greater than 7 characters';
        /[A-Z]/.test(value) ? this.passwordErrors['upper'] = '' : this.passwordErrors['upper'] = 'Password must have at least 1 uppercase character';
        /\d/.test(value) ? this.passwordErrors['number'] = '' : this.passwordErrors['number'] = 'Password must have at least 1 number';
      } else {
        this.passwordErrors = [];
      }
    },
    validateConfirmPassword(value) {
      if (value) {
        value === this.password ? this.confPasswordErrors['equals'] = '' : this.confPasswordErrors['equals'] = "Passwords don't match";
      } else {
        this.confPasswordErrors = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  form {
    margin: 5px 25vw;
    .form-group {
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
      .alert {
        color: red;
        margin: 0;
        font-size: 0.8em;
      }
    }
    .from-submit {
      text-align: right;
      button {
        background-color: #42b983;
        border: none;
        border-radius: 5px;
        color: #2c3e50;
        padding: 10px 20px;
        font-size: 1em;
        transition: 0.4s;
        &:disabled {
          background: #42b983b7;
          color: #2c3e50a1;
        }
      }
    }
  }
</style>
