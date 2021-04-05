<template>
  <div>
    <h2>Chatrooms</h2>
    <div class="side-bar">
      <ChatroomsSidebar>

      </ChatroomsSidebar>
    </div>
  </div>
</template>

<script>
// import firebase from 'firebase/app';
import { mapGetters } from "vuex";
import ChatroomsSidebar from '@/components/ChatroomsSidebar.vue'

export default {
  name: 'Lobby',
  data() {
    return {
      user: null
    }
  },
  components: {
    ChatroomsSidebar
  },
  computed: {
    ...mapGetters(['getUser', 'isUserAuth'])
  },
  created() {
    this.user = this.getUser;
  },
  methods: {
    
  }
};
</script>

<style lang='scss' scoped>
.side-bar {
  // width: 28%;
  // height: 80vh;
  margin: auto auto auto 20px;
  // border: 1px solid black;
}
</style>
