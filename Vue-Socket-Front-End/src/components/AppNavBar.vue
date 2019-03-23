<template>
  <v-toolbar>
    <v-toolbar-title>SPA Chat App</v-toolbar-title>
    <v-spacer></v-spacer>
    <div class="hidden-sm-and-down">
      <router-link
        v-for="routeView in routeList"
        :key="routeView.title"
        :to="routeView.to"
        v-if="routeView.show"
      >
        <v-btn flat>{{routeView.title}}</v-btn>
      </router-link>
    </div>
  </v-toolbar>
</template>
 <script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      routeList: [
        {
          title: "Welcome",
          to: "/welcome",
          show: this.$store.getters.getLoggedInStatus
        },
        {
          title: "All Users",
          to: "/all/users",
          show: this.$store.getters.getLoggedInStatus
        },
        {
          title:
            "All sender receiver messages" + this.$store.getters.getUsername,
          to:
            "/all/sender/receiver/messages/" + this.$store.getters.getUsername,
          show: this.$store.getters.getLoggedInStatus
        },
        {
          title: "Create Account",
          to: "/signup",
          show: !this.$store.getters.getLoggedInStatus
        },
        {
          title: "Login",
          to: "/login",
          show: !this.$store.getters.getLoggedInStatus
        },
        {
          title: "Logout",
          to: "/logout",
          show: this.$store.getters.getLoggedInStatus
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["getLoggedInStatus"])
  },
  watch: {
    getLoggedInStatus() {
      let show = this.$store.getters.getLoggedInStatus;
      let user = this.$store.getters.getUsername;
      this.routeList = [
        {
          title: "Welcome",
          to: "/welcome",
          show: show
        },
        {
          title: "All Users",
          to: "/all/users",
          show: show
        },
        {
          title: "All sender receiver messages" + user,
          to: "/all/sender/receiver/messages/" + user,
          show: show
        },
        {
          title: "Create Account",
          to: "/signup",
          show: !show
        },
        {
          title: "Login",
          to: "/login",
          show: !show
        },
        {
          title: "Logout",
          to: "/logout",
          show: show
        }
      ];
    }
  }
};
</script>
 <style>
</style>