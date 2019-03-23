<template>
  <v-container>
    <div>
      <ul v-for="user in users" :key="user.id">
        <li>
          <h4>
            <router-link
              :to="{name:'newChat', params:{username1:user.username,username2:currentUser}}"
            >Chat with user: {{user.username}}</router-link>
          </h4>
        </li>
        <br>
      </ul>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      users: [],
      currentUser: null
    };
  },
  computed: {
    ...mapGetters(["getLoggedInStatus", "getUserList"])
  },
  watch: {
    getUserList() {
      this.users = this.$store.getters.getUserList;
    },
    getLoggedInStatus() {
      console.log("hello redirect");
      this.redirectToNavigation(this.$store.getters.getLoggedInStatus);
    }
  },
  created() {
    // if the user is logged out then redirect to landing page
    if (this.$store.getters.getLoggedInStatus == false) {
      this.$router.push({ name: "landingPage" });
    }

    this.currentUser = this.$store.getters.getUsername;
    this.populateUsersTable;
    this.$store.dispatch("populateUsersList");
    this.users = this.$store.getters.getUserList;
  },
  methods: {
    populateUsersTable() {
      this.$store.dispatch("populateUsersList");
    },
    redirectToNavigation(status) {
      // if the user is logged out then return to landing page, if the user is logged then rediredct to welcome page
      if (status == false) {
        this.$router.push({ name: "landingPage" });
      }
    }
  },
  mounted() {
    console.log("hello kmounted");
    this.$store.dispatch("fetchUserList");
  }
};
</script>

<style>
</style>
