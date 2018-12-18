import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isLoggedIn: !!localStorage.getItem("username"),
    username: localStorage.getItem("username"),
    userList: {}
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
    }
  },
  actions: {
    login({ commit }, formData) {
      console.log(formData);
      let path = "/api/jwt/auth/login";
      axios
        .post(path, formData)
        .then(res => commit("VALIDATE_LOGIN", res))
        .catch(error => {
          console.log(formData);
          console.log(error.response);
        });
    },
    logout({ commit }) {
      let path = "/api/jwt/auth/logout";
      axios
        .post(path)
        .then(res => commit("LOGOUT", res))
        .catch(error => {
          console.log(error.response);
        });
      commit("LOGOUT");
    },
    signup({ commit }, formData) {
      let path = "/api/jwt/auth/signup";
      axios
        .post(path, formData)
        .then(res => commit("VALIDATE_LOGIN", res))
        .catch(error => console.log(error.response.data));
    },
    populateUsersList({ commit }) {
      let path = "/api/jwt/auth/users";
      axios
        .get(path)
        .then(res => {
          commit("POPULATEUSERSLIST", res.data);
        })
        .catch(error => console.log(error.response.data));
    },
    fetchUserList({ commit }) {
      commit("FETCHUSERLIST");
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
    }
  }
});

export default store;
