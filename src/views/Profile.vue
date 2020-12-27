<template>
  <div class="profile-container">
    <h2>Your Profile</h2>
    <div class="attributes-container">
      <div class="image-flip">
        <div class="avatar-flip">
          <img src="https://res.cloudinary.com/cloudiegosm/image/upload/v1600821767/DSM_scrbkr.jpg" height="150" width="150">
          <img src="https://res.cloudinary.com/cloudiegosm/image/upload/v1608956128/Upload_2_ltis4q.png" height="150" width="150">
        </div>
      </div>
      <h2>{{ username }}</h2>
      <EditField type="username" :key="username" v-bind:value="username" @usernameChange="handleUsernameChange" />
      <EditField type="email" :key="email" v-bind:value="email" @emailChange="handleEmailChange" />
      <EditPasswordField :key="password" v-bind:value="password" @passwordChange="handlePasswordChange" />
      <b-button v-if="somethingChanged" class="save-changes" variant="success" @click="saveChanges">Save Changes</b-button>
    </div>
    <b-button variant="danger" @click="deleteAccount">Delete Account</b-button>
    <p v-if="error" class="error-alert">{{ error.message }}</p>
  </div>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';
import EditField from '@/components/EditField.vue';
import EditPasswordField from '@/components/EditPasswordField.vue';
export default {
  name: 'Profile',
  components: {
    EditField,
    EditPasswordField
  },
  data() {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
      oldUsername: user.displayName,
      oldEmail: user.email,
      oldPassword: 'Password123',
      oldPhotoUrl: user.photoUrl,
      username: user.displayName,
      email: user.email,
      password: 'Password123',
      photoUrl: user.photoUrl,
      somethingChanged: false,
      error: ''
    }
  },
  updated() {
    this.checkForChanges();
  },
  methods: {
    handleUsernameChange(value) {
      this.username = value;
    },
    handleEmailChange(value) {
      this.email = value;
    },
    handlePasswordChange(value) {
      this.password = value;
    },
    checkForChanges() {
      if ((this.oldUsername !== this.username) ||
          (this.oldEmail !== this.email) ||
          (this.oldPassword !== this.password) ||
          (this.oldPhotoUrl !== this.photoUrl)) {
            this.somethingChanged = true;
      } else {
        this.somethingChanged = false;
      }
    },
    async saveChanges() {
      const user = await firebase.default.auth().currentUser;
      if (this.oldUsername !== this.username) {
        this.updateUsername(user);
        this.oldUsername = this.username;
      }
      if (this.oldEmail !== this.email) {
        this.updateEmail(user);
        this.oldEmail = this.email;
      }
      if (this.oldPassword !== this.password) {
        this.updatePassword(user);
        this.oldPassword = this.password;
      }
      if (this.oldPhotoUrl !== this.photoUrl) {
        this.updatePhotoUrl(user);
        this.oldPhotoUrl = this.photoUrl;
      }
      firebase
        .default
        .auth()
        .onAuthStateChanged((user) => {
          if (user) {
            this.somethingChanged = false;
            localStorage.removeItem('user');
            window.location = '/';
          }
      });
    },
    async updateUsername(user) {
      try {
        await user.updateProfile({ displayName: this.username });
      } catch(err) {
        this.error = err; setTimeout(() => this.error = '', 5000);
      }
    },
    async updateEmail(user) {
      try {
        await user.updateEmail(this.email);
      } catch(err) {
        this.error = err; setTimeout(() => this.error = '', 5000);
      }
    },
    async updatePassword(user) {
      try {
        await user.updatePassword(this.password);
      } catch(err) {
        this.error = err; setTimeout(() => { this.error = '' }, 5000);
      }
    },
    async updatePhotoUrl(user) {
      try {
        await user.updateProfile({ photoURL: this.photoUrl });
      } catch(err) {
        this.error = err; setTimeout(() => this.error = '', 5000);
      }
    },
    async deleteAccount() {
      const user = firebase.default.auth().currentUser;
      const confirmation = confirm('Are you sure?');
      try {
        if (confirmation) {
          await user.delete();
          this.$router.replace({ name: 'Home' });
        }
      } catch(err) {
        this.error = err; setTimeout(() => this.error = '', 5000);
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.profile-container {
  height: 85vh;
  margin: 0 30px;
  .attributes-container {
    position: relative;
    width: 600px;
    margin: 80px auto 30px;
    background-color: #fff;
    padding: 0 20px 20px;
    border-radius: 6px;
    box-shadow: 0px 3px 20px 4px rgba(0,0,0,0.54);
    text-align: center;
    .image-flip {
      width: 200px;
      height: 200px;
      border-radius: 100px;
      position: relative;
      margin: auto;
      top: -60px;
      &:hover .avatar-flip {
        transform: rotateY(180deg);
        img:first-child {
          opacity: 0;
        }
        img:last-child {
          opacity: 1;
        }
      }
      .avatar-flip {
        border-radius: 100px;
        overflow: hidden;
        height: 100%;
        width: 100%;
        transition: all 0.3s ease-in-out;
        box-shadow: 0px 3px 20px 4px rgba(0,0,0,0.54);
        img {
          height: 100%;
          width: 100%;
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 100px;
          transition: all 0.3s ease-in-out;
          &:first-child {
            z-index: 1;
          }
          &:last-child {
            z-index: 0;
            transform: rotateY(180deg);
            opacity: 0;
          }
        }
      }
    }
    h2 {
      font-size: 32px;
      font-weight: 600;
      margin: -45px 0 15px;
      color: #333;
    }
    .save-changes {
      position: absolute;
      bottom: -17px;
      right: 25px;
    }
  }
  .error-alert {
    color: red;
    font-size: 1em;
    margin: 20px auto;
  }
}
</style>
