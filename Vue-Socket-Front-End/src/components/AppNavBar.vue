<template>
  <v-toolbar>
    <v-toolbar-title>SPA Chat App</v-toolbar-title>
    <v-spacer></v-spacer>
    <div class="hidden-sm-and-down">
      <router-link v-for="routeView in routeList" :key="routeView.title" :to="routeView.to">
        <v-btn flat>{{routeView.title}}</v-btn>
      </router-link>
    </div>
  </v-toolbar>
</template>
 <script>
export default {
  data() {
    return {
      routeList: [
        {
          title: "All Users",
          to: "/admin/all/users"
        },
        {
          title: "Create Account",
          to: "/create"
        },
        {
          title: "Login",
          to: "/login"
        },
        {
          title: "Logout",
          to: "/logout"
        }
      ]
    };
  }
};
</script>
 <style>
</style>