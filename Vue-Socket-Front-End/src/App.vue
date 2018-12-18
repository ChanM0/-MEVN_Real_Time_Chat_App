<template>
  <v-app>
    <app-nav-bar></app-nav-bar>
    <router-view></router-view>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import AppNavBar from "./components/AppNavBar";
import AppFooter from "./components/AppFooter";
export default {
  name: "App",
  components: { AppNavBar, AppFooter }
};
</script>
