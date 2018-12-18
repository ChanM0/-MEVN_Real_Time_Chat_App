<template>
  <v-container>
    <h1>Messages between {{username1}} and {{username2}}</h1>
    <mess
      v-for="message in messagesBetweenUsers"
      :sender="message.sender"
      :receiver="message.receiver"
      :text="message.message"
      :timeStamp="message.timeStamp"
      :key="message.id"
    ></mess>
    <v-form @submit.prevent="sendMessage">
      <v-text-field v-model="form.message" label="Message" type="text" required></v-text-field>

      <v-btn color="green" type="submit">Send Message</v-btn>
    </v-form>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
import Mess from "./mess";
export default {
  components: { Mess },
  data() {
    return {
      username1: this.$route.params.username1,
      username2: this.$route.params.username2,
      messagesBetweenUsers: null,
      form: {
        sender: null,
        receiver: null,
        message: null
      }
    };
  },
  created() {
    if (this.$store.getters.getLoggedInStatus == false) {
      this.$router.push({ name: "landingPage" });
    } else {
      console.log("Hello there");
    }
    let user = this.$store.getters.getUsername;
    this.$store.dispatch("populateMessageChain", user);
    this.messagesBetweenUsers = this.$store.getters.getMessageChain;
    console.log(user);
    // this.
  },
  computed: {
    ...mapGetters(["getLoggedInStatus", "getMessageChain"])
  },
  watch: {
    getMessageChain() {
      this.messagesBetweenUsers = this.$store.getters.getMessageChain;
    },
    getLoggedInStatus() {
      console.log("hello redirect");
      this.redirectToNavigation(this.$store.getters.getLoggedInStatus);
    }
  },
  methods: {
    sendMessage() {
      this.form.sender = this.$route.params.username1;
      this.form.receiver = this.$route.params.username2;
      this.$store.dispatch("sendMessage", this.form);
    }
  },
  mounted() {
    console.log("hello kmounted");
    this.$store.dispatch("fetchMessageChain");
  }
};
</script>

<style>
</style>
