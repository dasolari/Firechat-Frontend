<template>
  <div class="main-frame">
    <h3 v-if="getCurrentRoom" class="room-name">
      {{ getCurrentRoom.name }}
    </h3>
    <div>
      <vue-webrtc 
        ref="webrtc" 
        width="100%"
        :roomId="getCurrentRoom.id"
        v-on:joined-room="attendeeJoined"
        v-on:left-room="attendeeLeft"
        @error="onError"
      />
    </div>
    <div id="main-buttons">
      <div class="icon-container">
        <b-icon v-if="mic" @click="toggleMic" icon="mic-fill" scale="2" variant="dark"></b-icon>
        <b-icon v-else @click="toggleMic" icon="mic-mute-fill" scale="2" variant="dark"></b-icon>
      </div>
      <div class="icon-container">
        <b-icon v-if="video" @click="toggleVideo" icon="camera-video-fill" scale="2" variant="dark"></b-icon>
        <b-icon v-else @click="toggleVideo" icon="camera-video-off-fill" scale="2" variant="dark"></b-icon>
      </div>
      <div class="icon-container">
        <b-icon icon="share-fill" scale="2" variant="dark"></b-icon>
      </div>
      <div class="icon-container">
        <b-icon icon="camera-fill" scale="2" variant="dark"></b-icon>
      </div>
    </div>
    <div class="leave-button-container">
      <b-button pill variant="outline-danger" @click="leaveRoom">Leave Room</b-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'Room',
  data() {
    return {
      mic: true,
      video: true,
      roomId: null
    }
  },
  mounted() {
    this.roomId = this.getCurrentRoom.id;
  },
  computed: {
    ...mapGetters(['getDatabase', 'getUser', 'getCurrentRoom'])
  },
  watch: {
    roomId(value) {
      if (value) {
        this.joinRoom();
      } else {
        this.leaveRoom();
      }
    }
  },
  methods: {
    joinRoom() {
      console.log(this.$refs.webrtc.roomId);
      this.$refs.webrtc.join();
      console.log(this.$refs.webrtc);
    },
    leaveRoom() {
      this.$store.commit('setCurrentRoom', null);
      this.$refs.webrtc.leave();
      this.$emit('left', 1);
    },
    toggleMic() {
      this.mic ? this.mic = false : this.mic = true;
    },
    toggleVideo() {
      this.video ? this.video = false : this.video = true;
    },
    attendeeJoined(joinId) {
      console.log('algo3?');
      const room = this.getDatabase.collection('rooms')
        .doc(this.roomId)
        .collection('attendees')
        .doc(this.getUser.uid);

      room.update({ webRTCId: joinId });
    },
    attendeeLeft() {
      const room = this.getDatabase.collection('rooms')
        .doc(this.roomId)
        .collection('attendees')
        .doc(this.getUser.uid);

      room.update({ webRTCId: null });
    },
    onError(error, stream) {
      console.log('On Error Event', error, stream);
    },
  }
};
</script>

<style lang="scss" scoped>
.main-frame {
  position: relative;
  height: 78vh;
  border-radius: 10px;
  border: 5px outset lightgray;
  .room-name {
    position: absolute;
    top: 1%;
    left: 1%;
  }
  .leave-button-container {
    position: absolute;
    bottom: 1.5%;
    right: 1%;
  }
  #main-buttons {
    position: absolute;
    display: block;
    width: fit-content;
    height: fit-content;
    bottom: 1%;
    left: 50%;
    transform: translate(-50%, -1%);
    .icon-container {
      margin: auto 10px;
      padding: 17px 21px 15px 21px;
      display: inline-block;
      border-radius: 100px;
      transition: 300ms;
      &:hover {
        background-color: rgba(233, 233, 233, 0.918);
      }
      &:active {
        background-color: rgb(207, 205, 205);
      }
    }
  }
}
</style>
