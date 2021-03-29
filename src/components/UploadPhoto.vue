<template>
  <div class="photo-container">
    <input class="choose-photo" type="file" accept="image/*" />
    <img src="https://res.cloudinary.com/cloudiegosm/image/upload/v1608956128/Upload_2_ltis4q.png" height="200" width="200">
  </div>
</template>

<script>
import firebase from 'firebase/app';
export default {
  name: 'UploadPhoto',
  // props: {
  //   oldPhotoUrl: String
  // },
  data() {
    return {
      imageData: null,
      photoURL: null
    }
  },
  methods: {
    previewImage(event) {
      this.imageData = event.target.files[0];
    }
  },
  async onUpload() {
    const storageRef = await firebase.storage().ref(String(this.imageData.name)).put(this.imageData);
    storageRef.on('state_changed', (snapshot) => {
      console.log(snapshot)
    }, (error) => {
      console.log(error.message)
    },() => {
      storageRef.snapshot.ref.getDownloadURL().then((url) => {
        this.photoURL = url;
      });
    });
  }
}
</script>

<style lang='scss' scoped>
.photo-container {
  width: 100%;
  height: 100%;
  border-radius: 100px;
  margin: auto;
  top: -60px;
  .choose-photo {
    width: 100%;
    height: 100%;
  }
}
</style>
