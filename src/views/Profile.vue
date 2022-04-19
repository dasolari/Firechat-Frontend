<template>
  <div class="profile-container">
    <h2>Your Profile</h2>
    <div class="attributes-container">
      <div class="image-flip">
        <div class="avatar-flip" @click="choosePhoto">
          <img v-if="photoURL" :src="photoURL" height="200" width="200">
          <img v-else src="https://res.cloudinary.com/cloudiegosm/image/upload/v1609270714/Profile2_sewzr6.png" height="200" width="200">
          <img src="https://res.cloudinary.com/cloudiegosm/image/upload/v1608956128/Upload_2_ltis4q.png" height="200" width="200">
          <input id="fileUpload" type="file" accept="image/*" @change="handleFile" hidden/>
        </div>
      </div>
      <h2>{{ username }}</h2>
      <EditField type="username" :key="username" v-bind:value="username" @usernameChange="handleUsernameChange" />
      <EditField type="email" :key="email" v-bind:value="email" @emailChange="handleEmailChange" />
      <EditPasswordField :key="password" v-bind:value="password" @passwordChange="handlePasswordChange" />
      <div class="button-container">
        <b-overlay :show="fileProgress !== null" rounded opacity="0.6" spinner-small spinner-variant="primary" class="d-inline-block">
          <b-button v-if="somethingChanged" class="save-changes" variant="success" @click="saveChanges">Save Changes</b-button>
        </b-overlay>
      </div>
    </div>
    <b-button variant="danger" @click="deleteAccount">Delete Account</b-button>
    <p v-if="getError" class="error-alert">{{ getError }}</p>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/storage';
import { mapGetters, mapActions } from "vuex";
import { getCurrentUser } from '@/services/user-getter.js';
import EditField from '@/components/profileComponents/EditField.vue';
import EditPasswordField from '@/components/profileComponents/EditPasswordField.vue';
export default {
  name: 'Profile',
  components: {
    EditField,
    EditPasswordField
  },
  data() {
    const user = getCurrentUser();
    return {
      oldUsername: user.displayName,
      oldEmail: user.email,
      oldPassword: 'Password123',
      oldPhotoURL: user.photoURL,
      username: user.displayName,
      email: user.email,
      password: 'Password123',
      photoURL: user.photoURL,
      imageData: null,
      somethingChanged: false,
      fileProgress: null
    }
  },
  updated() {
    this.checkForChanges();
  },
  computed: {
    ...mapGetters(['getUser', 'getError'])
  },
  methods: {
    ...mapActions(['authAction']),
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
          (this.oldPhotoURL !== this.photoURL)) {
            this.somethingChanged = true;
      } else {
        this.somethingChanged = false;
      }
    },
    choosePhoto() {
      document.getElementById('fileUpload').click();
    },
    handleFile(event) {
      this.imageData = event.target.files[0];
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.photoURL = e.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
    },
    async saveChanges() {
      const user = await firebase.auth().currentUser;
      let photoChanged = false;
      if (this.oldUsername !== this.username) {
        this.updateUsername(user);
        this.oldUsername = this.username;
        this.$events.$emit('changedUsername', this.username);
      }
      if (this.oldEmail !== this.email) {
        this.updateEmail(user);
        this.oldEmail = this.email;
      }
      if (this.oldPassword !== this.password) {
        this.updatePassword(user);
        this.oldPassword = this.password;
      }
      if (this.oldPhotoURL !== this.photoURL) {
        photoChanged = true;
        this.updatePhotoURL(user);
        this.oldPhotoURL = this.photoURL;
        this.$events.$emit('changedPhotoURL', this.photoURL);
      }
      this.authAction();
      setTimeout(() => {
        if (!photoChanged) window.location.reload();
      }, 500);
    },
    async updateUsername(user) {
      try {
        await user.updateProfile({ displayName: this.username });
      } catch(err) {
        this.$store.commit('setError', err.message);
      }
    },
    async updateEmail(user) {
      try {
        await user.updateEmail(this.email);
      } catch(err) {
        this.$store.commit('setError', err.message);
      }
    },
    async updatePassword(user) {
      try {
        localStorage.setItem('alert', 'Logged out for security reasons, but your password was changed successfully');
        await user.updatePassword(this.password);
      } catch(err) {
        this.$store.commit('setError', err.message);
      }
    },
    updatePhotoURL(user) {
      try {
        const storageRef = firebase.storage().ref(`profile-pictures/${this.imageData.name}`);
        const uploadTask = storageRef.put(this.imageData);
        uploadTask.on(`state_changed`, (snapshot) => {
          this.fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL()
          .then(async (url) => {
            this.photoURL = url;
            await user.updateProfile({ photoURL: url });
            this.fileProgress = null;
          });
        });
      } catch(err) {
        this.$store.commit('setError', err.message);
      }
    },
    async deleteAccount() {
      const user = await firebase.default.auth().currentUser;
      const confirmation = confirm('Are you sure?');
      try {
        if (confirmation) {
          await user.delete();
          this.$router.replace({ name: 'Home' });
        }
      } catch(err) {
        this.$store.commit('setError', err.message);
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
    .button-container {
      position: absolute;
      right: 25px;
      bottom: -20px;
      b-overlay {
        margin: 0;
        padding: 0;
      }
    }
  }
  .error-alert {
    color: red;
    font-size: 1em;
    margin: 20px auto;
  }
}
</style>
