<template>
  <div class="name-container">
    <div class="clickable" @click="joinRoom"></div>
    <p class="name">
      {{ this.specs.name }}
    </p>
    <p class="owner">
      {{ this.specs.owner }} {{ getUser.uid == this.specs.ownerId ? '(You)' : '' }}
    </p>
    <p class="capacity">
      {{ filledVacancies }}/{{ this.specs.capacity }}
    </p>
    <div class="delete" v-if="getUser.uid == this.specs.ownerId">
      <b-icon icon="trash" scale="1" variant="danger" @click="deleteRoom"></b-icon>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'RoomDisplay',
  props: {
    specs: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      filledVacancies: 0
    }
  },
  mounted() {

  },
  computed: {
    ...mapGetters(['getUser'])
  },
  methods: {
    deleteRoom() {
      this.$emit('deleted', this.specs.id);
    },
    joinRoom() {
      this.$store.commit('setCurrentRoom', this.specs);
      this.$emit('joined', this.specs.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.name-container {
  position: relative;
  margin: 5px 7px;
  padding: 5px;
  border-radius: 5px;
  background-color: #42b983;
  box-shadow: 1px 0px 3px 1px rgba(0,0,0,0.35);
  &:active {
    box-shadow: 1px 0px 6px 1px rgba(0,0,0,0.35);
  }
  &:hover {
    .delete {
      visibility: visible;
    }
  }
  .clickable {
    position: absolute;
    top: 0;
    left: 0;
    width: 90%;
    height: 100%;
  }
  p {
    padding: 0;
    margin: 0;
  }
  .name {
    text-align: left;
    font-weight: 800;
    font-size: 1.3rem;
  }
  .owner {
    display: inline-block;
    width: 50%;
    text-align: left;
    font-size: 1rem;
  }
  .capacity {
    display: inline-block;
    width: 50%;
    text-align: right;
    font-size: 1rem;
  }
  .delete {
    visibility: hidden;
    position: absolute;
    top: 0px;
    right: 3px;
  }
}
</style>
