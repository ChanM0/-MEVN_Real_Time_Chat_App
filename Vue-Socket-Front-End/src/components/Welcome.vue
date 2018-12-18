<template>
  <v-container fluid grid-list-md>
    <h1>Last 50 messages</h1>
    <mess
      v-for="message in last50Messages"
      :sender="message.sender"
      :receiver="message.receiver"
      :text="message.message"
      :timeStamp="message.timeStamp"
      :key="message.id"
    ></mess>
  </v-container>
</template>
<script>
// add import on message list
import { mapGetters } from "vuex";
import Mess from "./ChatComponents/mess";
export default {
  name: "Welcome",
  components: { Mess },
  data() {
    return {
      last50Messages: {}
    };
  },
  created() {
    if (this.$store.getters.getLoggedInStatus == false) {
      this.$router.push({ name: "landingPage" });
    } else {
      console.log("Hello there");
    }
    let user = this.$store.getters.getUsername;
    this.$store.dispatch("populateLast50Messages", user);
    this.last50Messages = this.$store.getters.getLast50Messages;
    console.log(user);
    // this.
  },
  computed: {
    ...mapGetters(["getLoggedInStatus", "getLast50Messages"])
  },
  watch: {
    getLast50Messages() {
      this.last50Messages = this.$store.getters.getLast50Messages;
    },
    getLoggedInStatus() {
      console.log("hello redirect");
      this.redirectToNavigation(this.$store.getters.getLoggedInStatus);
    }
  },
  mounted() {
    console.log("hello kmounted");
    this.$store.dispatch("fetchLast50Messages");
  }
  // add watch
  // add methods
};
</script>
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
