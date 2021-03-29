<template>
  <b-button v-if="isUserAuth" variant="outline-danger" @click="signOut">Logout</b-button>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { deleteCurrentUser } from '@/services/user-getter.js';
export default {
  name: 'LogOut',
  data() {
    return {
      loggedIn: false
    }
  },
  mounted() {
    this.authAction();
  },
  computed: {
    ...mapGetters(['isUserAuth'])
  },
  methods: {
    ...mapActions(['authAction', 'signOutAction']),
    signOut() {
      this.signOutAction();
      deleteCurrentUser();
      window.location = '/';
    }
  }
}
</script>
