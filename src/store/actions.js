import firebase from "firebase/app";
import { saveCurrentUser } from '../services/user-getter';


const actions = {
  authAction({ commit }) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        saveCurrentUser(user);
        commit("setUser", user);
        return user;
      } else {
        commit("setUser", null);
      }
    });
  },
  signUpAction({ commit }, payload) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .catch((error) => {
        commit("setError", error.message);
      });
  },
  logInAction({ commit }, payload) {
    firebase
      .auth()
      .signInWithEmailAndPassword(payload.email, payload.password)
      .catch((error) => {
        commit("setError", error.message);
      });
  },
  signOutAction({ commit }) {
    firebase
      .auth()
      .signOut()
      .catch(error => {
        commit("setError", error.message);
      });
  }
};

export default actions;
