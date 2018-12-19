<template>
  <v-container fluid grid-list-md>
    <v-form @submit.prevent="populateThis">
      <v-btn color="green" type="submit">Get All Users</v-btn>
    </v-form>
    <v-container>
      <h1>{{username}}'s Sender messages</h1>
      <mess
        v-for="message in senderMessages"
        :sender="message.sender"
        :receiver="message.receiver"
        :text="message.message"
        :timeStamp="message.timeStamp"
        :key="message.id"
      >
        <hr>
      </mess>
    </v-container>
    <hr>
    <hr>
    <v-container fluid grid-list-md>
      <h1>{{username}}'s receiver messages</h1>
      <mess
        v-for="message in receiverMessages"
        :sender="message.sender"
        :receiver="message.receiver"
        :text="message.message"
        :timeStamp="message.timeStamp"
        :key="message.id"
      >
        <hr>
      </mess>
    </v-container>
  </v-container>
</template>
<script>
// add import on message list
import { mapGetters } from "vuex";
import Mess from "./mess";
export default {
  components: { Mess },
  data() {
    return {
      user: {},
      username: this.$route.params.username,
      senderMessages: {},
      receiverMessages: {}
    };
  },
  computed: {
    ...mapGetters([
      "getLoggedInStatus",
      "getSenderMessages",
      "getReceiverMessages"
    ])
  },
  created() {
    if (this.$store.getters.getLoggedInStatus == false) {
      this.$router.push({ name: "landingPage" });
    } else {
      this.user = this.$store.getters.getUsername;
      this.$store.dispatch("populateAllMessagesSentReceived", this.user);
    }
  },
  methods: {
    populateThis() {
      this.$store.dispatch("populateAllMessagesSentReceived", this.user);
    },
    update() {
      this.senderMessages = this.$store.getters.getSenderMessages;
      this.receiverMessages = this.$store.getters.getReceiverMessages;
    }
  },
  watch: {
    getSenderMessages() {
      this.senderMessages = this.$store.getters.getSenderMessages;
      console.log("Begin  getSenderMessages*******");
      console.log(this.senderMessages);
      console.log(this.$store.getters.getSenderMessages);
      console.log("end  getSenderMessages*******");
    },
    getReceiverMessages() {
      this.receiverMessages = this.$store.getters.getReceiverMessages;
      console.log("Begin  getSenderMessages*******");
      console.log(this.senderMessages);
      console.log(this.$store.getters.getSenderMessages);
      console.log("end  getSenderMessages*******");
    },
    getLoggedInStatus() {
      this.redirectToNavigation(this.$store.getters.getLoggedInStatus);
    }
  },
  mounted() {
    this.$store.dispatch("fetchAllMessagesSentReceived");
  }
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
