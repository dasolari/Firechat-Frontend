<template>
  <div class="field-container">
    <label v-bind:for="type">{{ capitalize(type) }}:</label>
    <p class="field" v-if="!selected">{{ newValue }}</p>
    <input
      v-if="selected"
      v-bind:type="type"
      v-bind:id="type"
      v-bind:name="type"
      v-bind:maxLength="length"
      v-model="newValue"
      @blur="toggleSelect" />
    <p class="warning-alert" v-if="invalidEmail">This must be an email</p>
    <b-button
      v-if="!selected"
      class="edit-button"
      variant="dark"
      size="sm"
      @click="toggleSelect">
      edit
    </b-button>
  </div>
</template>

<script>
const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export default {
  name: 'EditField',
  props: {
    type: String,
    value: String
  },
  data() {
    return {
      selected: false,
      length: '256',
      newValue: this.value
    }
  },
  created() {
    if (this.type === 'username') this.length = '25';
  },
  computed: {
    invalidEmail() {
      if (this.type === 'email') {
        return this.newValue && !(re.test(this.newValue));
      }
      return false;
    }
  },
  methods: {
    capitalize(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    },
    toggleSelect() {
      this.selected = !this.selected;
      if (this.selected) {
        this.focusOnTarget();
      } else {
        this.emitNewValue();
      }
    },
    focusOnTarget() {
      setTimeout(() => {
        const field = document.getElementById(this.type);
        field.focus();
      }, 100);
    },
    emitNewValue() {
      if (this.type === 'email' && !(re.test(this.newValue))) {
        this.newValue = this.value;
      } else {
        const eventName = `${this.type}Change`;
        this.$emit(eventName, this.newValue);
      }
    }
  }
}
</script>

<style lang='scss'>
.field-container {
  position: relative;
  margin: 15px 0;
  padding: 5px;
  height: fit-content;
  width: 100%;
  border-radius: 3px;
  text-align: left;
  label {
    margin: 0;
    padding: 0;
    width: 100%;
    font-size: 0.9em;
  }
  p.field {
    width: 100%;
    margin: 0;
    padding: 2px 2px 1px;
    border-radius: 4px;
    background-color: rgba(230, 224, 224, 0.911);
  }
  input {
    width: 99%;
    padding: 1px 2px;
    border: none;
    outline: none;
    font-size: 1em;
    border-bottom: 1px solid #42b983;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
      transition: background-color 5000s ease-in-out 0s;
  }
  .edit-button {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
}
.warning-alert {
  color: red;
  margin: 0;
  padding: 0;
  font-size: 0.8em;
}
</style>
