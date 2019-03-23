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
  },
  sockets: {
    messageChannel(data) {
      console.log(data);
      console.log(data[0]);
      console.log("test");
      let senderIncoming = data[0].sender;
      let receiverIncoming = data[0].receiver;
      console.log(data[0].sender);
      console.log(senderIncoming);
      console.log(typeof senderIncoming);
      console.log(receiverIncoming);
      console.log(typeof receiverIncoming);

      console.log(this.form.sender);
      console.log(typeof this.form.sender);
      console.log(this.form.receiver);
      console.log(typeof this.form.receiver);

      let checkSender = "" + this.$route.params.username1;
      let checkReceiver = "" + this.$route.params.username2;

      console.log(checkSender);
      console.log(typeof checkSender);
      console.log(checkReceiver);
      console.log(typeof checkReceiver);
      // let data[0] = data[0];

      let bool1 = senderIncoming == checkSender;
      let bool2 = receiverIncoming == checkReceiver;
      let bool3 = receiverIncoming == checkSender;
      let bool4 = senderIncoming == checkReceiver;

      console.log("incomingMessage");
      console.log(bool1);
      console.log(bool2);
      console.log(bool3);
      console.log(bool4);
      // console.log(incomingMessage);
      console.log(this.form);
      console.log("incomingMessage");
      let masterBool = (bool1 && bool2) || (bool3 && bool4);
      console.log(masterBool);
      if (masterBool) {
        this.$store.dispatch("incomingMessage", data);
      }
    }
  }
};
</script>

<style>
</style>
