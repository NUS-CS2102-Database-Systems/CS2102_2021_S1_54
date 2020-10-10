import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./components/Home";

Vue.use(VueRouter);

// application routes
// export router instance
export default new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
  ],
});
