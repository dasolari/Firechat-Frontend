const mutations = {
  setUser(state, payload) {
    state.user = payload;
  },
  setError(state, payload) {
    state.error = payload;
    setTimeout(() => { state.error = null; }, 6500);
  }
};

export default mutations;
