<template>
  <div class="home">
    <p class="alert" :key="alert" v-if="alert">{{ alert }}</p>
    <div class="flip-container">
      <div class="flipcard">
        <div class="card-face card-face-front">
          <SignUp @created="flipCard" message="Create an account"/>
        </div>
        <div class="card-face card-face-back">
          <LogIn @verify="showMessageAgain" message="Log into your account" :key="flipped" />
          <p class="verification-message" v-if="isUserAuth && !getUser.emailVerified">We have sent you a verification email</p>
          <a class="verification-link" @click="sendVerificationEmail" v-if="isUserAuth && !getUser.emailVerified">Didn't get one? Resend verification email</a>
        </div>
      </div>
    </div>
    <div class="flipper">
      <p v-if="!flipped">Already have an account? Try logging in</p>
      <p v-if="flipped">Don't have an account? Try signing up</p>
      <b-button v-if="!flipped" variant="outline-primary" @click="flipCard">Log In</b-button>
      <b-button v-if="flipped" variant="outline-primary" @click="flipCard">Sign Up</b-button>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import { mapGetters } from "vuex";
import SignUp from '@/components/SignUp.vue';
import LogIn from '@/components/LogIn.vue';

export default {
  name: 'Home',
  data() {
    return {
      flipped: false,
      alert: ''
    }
  },
  components: {
    SignUp,
    LogIn
  },
  computed: {
    ...mapGetters(['getUser', 'isUserAuth'])
  },
  created() {
    this.showAlert();
  },
  methods: {
    flipCard() {
      const flipcard = document.querySelector('.flipcard');
      const front = document.querySelector('.card-face.card-face-front');
      flipcard.classList.toggle('is-flipped');
      setTimeout(() => { front.classList.toggle('deactivate'); }, 290);
      this.flipped ? this.flipped = false : this.flipped = true;
    },
    async sendVerificationEmail() {
      const user = await firebase.auth().currentUser;
      try {
        await user.sendEmailVerification();
      } catch(err) {
        localStorage.setItem('alert', err.message);
        this.showAlert();
      }
    },
    showMessageAgain() {
      const verificationMessage = document.querySelector('.verification-message');
      const verificationLink = document.querySelector('.verification-link');
      if (verificationMessage && verificationLink) {
        verificationMessage.classList.toggle('emphasize');
        setTimeout(() => {
          verificationMessage.classList.toggle('emphasize');
          verificationLink.classList.toggle('emphasize');
          setTimeout(() => {
            verificationLink.classList.toggle('emphasize');
          }, 2000);
        }, 2000);
      }
    },
    showAlert() {
      const alert = localStorage.getItem('alert');
      localStorage.removeItem('alert');
      if (alert) {
        this.alert = alert;
        setTimeout(() => { this.alert = ''; }, 5000);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  .flipper {
    margin: 10px auto;
  }
  .alert {
    color: red;
    margin: 0 auto 5px auto;
    width: fit-content;
    padding: 2px;
    font-size: 0.8em;
    border-radius: 5px;
    border: 1px solid red;
  }
}
.flip-container {
  margin: auto 25vw;
  width: auto;
  height: 510px;
  perspective: 1000px;
  .flipcard {
    width: 100%;
    height: 100%;
    transition: transform 1s;
    transform-style: preserve-3d;
    // position: relative;
    .card-face {
      position: absolute;
      width: 100%;
      height: 100%;
      -webkit-backface-visibility: hidden;
      -moz-backface-visibility: hidden;
      backface-visibility: hidden;
    }
    .card-face-front {
      background: none;
    }
    .card-face-back {
      background: none;
      transform: rotateY(180deg);
      .verification-message {
        margin: 10px auto 0 auto;
        color: #42b983;
        font-size: 0.8em;
        transition: 300ms;
      }
      .verification-link {
        color: #42b983;
        font-size: 0.8em;
        transition: 300ms;
        cursor: pointer;
      }
      .emphasize {
        font-size: 1em;
        transition: 300ms;
      }
    }
  }
}
.flipcard.is-flipped {
  transform: rotateY(180deg);
}
.card-face.card-face-front.deactivate {
  display: none;
}
</style>
