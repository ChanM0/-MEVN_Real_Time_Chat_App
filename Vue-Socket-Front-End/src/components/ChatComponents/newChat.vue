<template>
  <v-container>
    <div>
      <h1>hellow world</h1>
    </div>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      username1: this.$route.params.username1,
      username2: this.$route.params.username2,
      messagesBetweenUsers: null
    };
  }
};
</script>

<style>
</style>
