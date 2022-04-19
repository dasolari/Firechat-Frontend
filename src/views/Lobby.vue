<template>
  <div>
    <h2>Chatrooms</h2>
    <div class="lobby-container">
      <div id="side-bar">
        <ChatroomsSidebar @joined="showRoom" />
      </div>
      <div id="video-container">
        <Room @left="leaveRoom" v-if="inRoom" />
        <div id="pre-room-screen">
          <div class="icon-container chat-right">
            <b-icon icon="chat-right-text" scale="2" variant="primary"></b-icon>
          </div>
          <div class="icon-container">
            <b-icon icon="emoji-laughing" scale="3" variant="primary"></b-icon>
          </div>
          <div class="icon-container">
            <b-icon icon="camera-video" animation="cylon-vertical" scale="3" variant="primary"></b-icon>
          </div>
          <div class="icon-container">
            <b-icon icon="emoji-smile" scale="3" variant="primary"></b-icon>
          </div>
          <div class="icon-container chat-left">
            <b-icon icon="chat-left-dots" scale="2" variant="primary"></b-icon>
          </div>
          <p>Join a room by clicking on it :)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import firebase from 'firebase/app';
import { mapGetters } from 'vuex';
import ChatroomsSidebar from '@/components/lobbyComponents/ChatroomsSidebar.vue';
import Room from '@/components/lobbyComponents/Room.vue';

export default {
  name: 'Lobby',
  data() {
    return {
      user: null,
      inRoom: false
    }
  },
  components: {
    ChatroomsSidebar,
    Room
  },
  computed: {
    ...mapGetters(['getUser', 'isUserAuth'])
  },
  created() {
    this.user = this.getUser;
  },
  methods: {
    showRoom(id) {
      // To Do something with this
      this.inRoom = true;
      console.log(id);
    },
    leaveRoom() {
      this.inRoom = false;
    }
  },
  watch: {
    inRoom(value) {
      const sideBar = document.getElementById('side-bar');
      const videoContainer = document.getElementById('video-container');
      const prs = document.getElementById('pre-room-screen');
      value ? sideBar.style.width = '28%' : sideBar.style.width = '50%';
      value ? videoContainer.style.width = '65%' : videoContainer.style.width = '43%';
      value ? prs.style.display = 'none' : prs.style.display = 'block';
    }
  }
};
</script>

<style lang='scss' scoped>
.lobby-container {
  display: flex;
  justify-content: space-evenly;
  margin: auto 20px auto auto;
  #side-bar {
    width: 50%;
    display: inline-block;
    transition: 350ms;
  }
  #video-container {
    position: relative;
    width: 43%;
    display: inline-block;
    transition: 350ms;
    #pre-room-screen {
      position: absolute;
      display: block;
      width: fit-content;
      height: fit-content;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -40%);
      p {
        padding: 10px;
        text-align: center;
        color: #0275d8;
      }
      .icon-container {
        margin: auto 10px;
        padding: 20px;
        display: inline-block;
      }
      .chat-left {
        position: absolute;
        top: -1.5rem;
        right: -1.8rem;
      }
      .chat-right {
        position: absolute;
        top: -1.5rem;
        left: -1.9rem;
      }
    }
  }
}
</style>
