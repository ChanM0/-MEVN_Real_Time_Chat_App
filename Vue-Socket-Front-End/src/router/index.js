import Vue from "vue";
import VueRouter from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import welcome from "@/components/HelloWorld";
import login from "@/components/Forms/Login";
import logout from "@/components/Forms/Logout";
import signup from "@/components/Forms/Signup";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "landingPage",
    component: HelloWorld
  },
  {
    path: "/welcome",
    name: "welcome",
    component: welcome
  },
  {
    path: "/login",
    component: login,
    name: "login"
  },
  {
    path: "/logout",
    component: logout,
    name: "logout"
  },
  {
    path: "/signup",
    component: signup,
    name: "signup"
  }
];
const router = new VueRouter({
  mode: "history",
  routes
});
export default router;
