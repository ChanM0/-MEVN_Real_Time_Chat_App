<template>
  <v-container>
    <v-form @submit.prevent="login">
      <v-text-field v-model="form.email" label="E-mail" type="email" required></v-text-field>

      <v-text-field v-model="form.password" label="Password" type="password" required></v-text-field>

      <v-btn color="green" type="submit">Login</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        email: null,
        password: null
      }
    };
  },
  computed: {
    ...mapGetters(["getLoggedInStatus"])
  },
  watch: {
    getLoggedInStatus() {
      // logged in status chagnes then redirect navigation
      this.redirectToNavigation(this.$store.getters.getLoggedInStatus);
    }
  },
  created() {
    if (this.$store.getters.getLoggedInStatus != false) {
      this.$router.push({ name: "landingPage" });
    }
  },
  methods: {
    login() {
      this.$store.dispatch("login", this.form);
      // if logged in redirect to welcome page
      if (this.$store.getters.getLoggedInStatus) {
        this.$router.push({ name: "welcome" });
      }
    },
    redirectToNavigation(status) {
      // if the user is logged out then return to landing page, if the user is logged then rediredct to welcome page
      if (status == false) {
        this.$router.push({ name: "landingPage" });
      } else {
        this.$router.push({ name: "welcome" });
      }
    }
  }
};
</script>

<style>
</style>
