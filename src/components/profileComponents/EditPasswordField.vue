<template>
  <div class="password-edit">
    <div class="field-container">
      <label for="password">Password:</label>
      <p class="field" v-if="!selected">{{ '●'.repeat(password.length) }}</p>
      <input v-if="selected" type="password" id="password" name="password" v-model="password" @blur="toggleSelect" />
      <p class="warning-alert" v-if="invalidPasswordLength">Password must be greater than 7 characters</p>
      <p class="warning-alert" v-if="invalidPasswordUppercase">Password must have at least 1 uppercase character</p>
      <p class="warning-alert" v-if="invalidPasswordNumber">Password must have at least 1 number</p>
      <b-button v-if="!selected" class="edit-button" variant="dark" size="sm" @click="toggleSelect">
        edit
      </b-button>
    </div>
    <p class="warning-alert" v-if="anyProblems">Fix current problems or leave blank to cancel</p>
    <div v-if="selected" class="field-container">
      <label for="password">Confirm Password:</label>
      <input type="password" id="passwordConf" name="passwordConf" v-model="confirmPassword" @blur="toggleSelect" />
      <p class="warning-alert" v-if="invalidConfirmPassword">Passwords don't match</p>
    </div>
  </div>
</template>

<script>
const pu = /[A-Z]/;
const pn = /\d/;
export default {
  name: 'EditPasswordField',
  props: {
    value: String
  },
  data() {
    return {
      selected: false,
      password: this.value,
      confirmPassword: '',
      anyProblems: false
    }
  },
  computed: {
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
    toggleSelect() {
      if (!this.selected) {
        this.focusOnTarget();
      } else {
        this.emitNewValue();
      }
    },
    focusOnTarget() {
      this.selected = true;
      setTimeout(() => {
        const field = document.getElementById('password');
        field.focus();
      }, 100);
    },
    emitNewValue() {
      const p = this.password;
      const cp = this.confirmPassword;
      if (this.validate()) {
        this.$emit('passwordChange', this.password);
        this.selected = false;
      } else if (!p) {
        this.password = this.value;
        this.confirmPassword = '';
        this.selected = false;
      } else if (p === this.value) {
        this.confirmPassword = '';
        this.selected = false;
      } else {
        if (cp) {
          this.anyProblems = true;
          setTimeout(() => {
            this.anyProblems = false;
          }, 4000);
        }
      }
    },
    validate() {
      const PL = this.password.length >= 8;
      const PU = pu.test(this.password);
      const PN = pn.test(this.password);
      const CP = this.password === this.confirmPassword;
      return this.password !== 'Password123' && this.password !== this.value && PL && PU && PN && CP;
    }
  }
}
</script>

<style lang='scss' scoped>
.password-edit {
  height: fit-content;
}
</style>
