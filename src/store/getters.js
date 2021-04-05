const getters = {
  getUser(state) {
    return state.user;
  },
  getDatabase(state) {
    return state.db;
  },
  isUserAuth(state) {
    return !!state.user;
  },
  getError(state) {
    return state.error;
  }
};

export default getters;
