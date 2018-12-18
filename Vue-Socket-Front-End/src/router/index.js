import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import HelloWorld from "@/components/HelloWorld";
import welcome from "@/components/Welcome";
import login from "@/components/Forms/Login";
import logout from "@/components/Forms/Logout";
import signup from "@/components/Forms/Signup";
import AllUsers from "@/components/ChatComponents/AllUsersList";
import newChat from "@/components/ChatComponents/newChat";

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
    path: "/newChat/:username1/:username2",
    name: "newChat",
    component: newChat
  },
  {
    path: "/all/users",
    name: "allUsers",
    component: AllUsers
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
