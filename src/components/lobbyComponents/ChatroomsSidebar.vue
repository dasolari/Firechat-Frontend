<template>
  <div>
    <div class="chatrooms">
      <p v-if="rooms && !rooms.length">No rooms yet...</p>
      <div v-for="room in rooms" :key="room.id" v-chat-scroll="{always: false, smooth: true}">
        <RoomDisplay v-bind:specs="room" @deleted="deleteRoom" @joined="joinRoom" />
      </div>
    </div>
    <div class="room-form">
      <h4>Create a room</h4>
      <b-form @submit="onSubmit">
        <b-form-group>
          <b-form-input v-model="form.roomName" type="text" placeholder="Room Name" required></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-input v-model="form.capacity" type="number" placeholder="Capacity (30 max)" max="30" min="2" required></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="outline-success">Create</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';
import { mapGetters } from "vuex";
import RoomDisplay from '@/components/lobbyComponents/RoomDisplay.vue';

export default {
  name: 'ChatroomsSidebar',
  data() {
    return {
      rooms: [],
      form: {
          roomName: '',
          capacity: null
        },
    }
  },
  components: {
    RoomDisplay
  },
  created() {
    // Gets all rooms in ascendant order and unshifts in order to keep most recent up top
    const roomCollection = this.getDatabase.collection('rooms').orderBy('createdAt', 'asc');
    roomCollection.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type == 'added') {
          const data = change.doc.data();
          const newRoom = {
            id: change.doc.id,
            name: data.name,
            capacity: data.capacity,
            owner: data.owner,
            ownerId: data.ownerId,
            createdAt: data.createdAt
          };
          this.rooms.unshift(newRoom);
        }
        if (change.type == 'removed') {
          this.rooms = this.rooms.filter((elem) => elem.id != change.doc.id);
        }
      })
    })
  },
  computed: {
    ...mapGetters(['getDatabase', 'getUser'])
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();
      const data = {
        name: this.form.roomName,
        capacity: Number(this.form.capacity),
        owner: this.getUser.displayName,
        ownerId: this.getUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      try {
        const roomCollection = this.getDatabase.collection('rooms');
        await roomCollection.add(data);
      } catch (error) {
        console.log;
      } finally {
        this.form = {};
      }
    },
    async deleteRoom(id) {
      const roomCollection = this.getDatabase.collection('rooms');
      try {
        await roomCollection.doc(id).delete();
      } catch (error) {
        console.log;
      }
    },
    joinRoom(id) {
      this.$emit('joined', id);
    }
  }
};
</script>

<style lang="scss" scoped>
.chatrooms {
  height: 50vh;
  overflow-y: scroll;
  background-color: rgb(228, 222, 222);
  border-radius: 5px;
  border: 3px outset lightgray;
}
.room-form {
  margin-top: 10px;
}
</style>
