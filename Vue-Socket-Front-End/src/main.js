// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

import VueSocketio from "vue-socket.io";

Vue.use(Vuetify);
// Vue.use(VueChatScroll);
Vue.use(VueSocketio, "http://localhost:3000");

Vue.config.productionTip = false;

import store from "./Store/store.js";

import { mapGetters } from "vuex";

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
