import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import SubmitReview from "./components/pet_owner/SubmitReview";
import ViewReviews from "./components/caretaker/ViewReviews";


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
    {
      path: "/sign-up",
      name: "SignUp",
      component: SignUp,
    },
    {
      path: "/log-in",
      name: "LogIn",
      component: LogIn,
    },
    {
      path: "/submit-review", //TODO: change this later
      name: "SubmitReview",
      component: SubmitReview,
    },
    {
      path: "/view-reviews", //TODO: change this later
      name: "ViewReviews",
      component: ViewReviews,
    },
  ],
});
