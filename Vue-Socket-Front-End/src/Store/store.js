import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const API = "http://localhost:3000/api/";

const store = new Vuex.Store({
  state: {
    isLoggedIn: !!localStorage.getItem("username"),
    username: localStorage.getItem("username"),
    userList: {},
    last50Messages: {}
  },
  mounted() {
    if (localStorage.getItem("userList")) {
      try {
        this.userList = JSON.parse(localStorage.getItem("userList"));
      } catch (e) {
        localStorage.removeItem("userList");
      }
    }
  },
  mutations: {
    VALIDATE_LOGIN(state, res) {
      console.log(res.data);
      const username = res.data.username;
      localStorage.setItem("username", username);
      state.isLoggedIn = localStorage.getItem("username") ? true : false;
      state.username = username;
    },
    LOGOUT(state) {
      localStorage.clear();
      state.isLoggedIn = localStorage.getItem("username") ? true : false;
      state.username = null;
      state.userList = {};
    },
    POPULATEUSERSLIST(state, res) {
      state.userList = res;
      console.log(res);
      res = JSON.stringify(res);
      localStorage.setItem("userList", res);
    },
    FETCHUSERLIST(state) {
      var data = JSON.parse(localStorage.getItem("userList"));
      state.userList = data;
    },
    POPULATELAST50MESSAGES(state, res) {
      state.last50Messages = res;
      console.log(res);
      res = JSON.stringify(res);
      localStorage.setItem("last50Messages", res);
    },
    FETCHLAST50MESSAGES(state) {
      var data = JSON.parse(localStorage.getItem("last50Messages"));
      state.last50Messages = data;
    }
  },
  actions: {
    login({ commit }, formData) {
      console.log(formData);
      let path = "login/user";
      axios
        .post(API + path, formData)
        .then(res => commit("VALIDATE_LOGIN", res))
        .catch(error => {
          // console.log(formData);
          console.log(error.response);
        });
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
    signup({ commit }, formData) {
      let path = "create/user";
      axios
        .post(API + path, formData)
        .then(res => commit("VALIDATE_LOGIN", res))
        .catch(error => console.log(error.response.data));
    },
    populateUsersList({ commit }) {
      let path = "all/users";
      axios
        .get(API + path)
        .then(res => {
          commit("POPULATEUSERSLIST", res.data);
        })
        .catch(error => console.log(error.response.data));
    },
    fetchUserList({ commit }) {
      commit("FETCHUSERLIST");
    },
    populateLast50Messages({ commit }, user) {
      let path = "chat/50/" + user;
      path = API + path;
      console.log(path);
      axios
        .get(path)
        .then(res => {
          commit("POPULATELAST50MESSAGES", res.data);
        })
        .catch(error => console.log(error.response.data));
    },
    fetchLast50Messages({ commit }) {
      commit("FETCHLAST50MESSAGES");
    }
  },
  getters: {
    getUsername: state => {
      return state.username;
    },
    getLoggedInStatus: state => {
      return state.isLoggedIn;
    },
    getUserList: state => {
      console.log(state.userList);
      return state.userList;
    },
    getLast50Messages: state => {
      return state.last50Messages;
    }
  }
});

export default store;
