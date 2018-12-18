<template></template>

<script>
import { mapGetters } from "vuex";
export default {
  created() {
    let isUserLoggedIn = this.$store.getters.getLoggedInStatus;
    if (isUserLoggedIn == false) {
      this.$router.push({ name: "landingPage" });
    }
    this.$store.dispatch("logout");
    this.$router.push({ name: "landingPage" });
  }
};
</script>

<style>
</style>
