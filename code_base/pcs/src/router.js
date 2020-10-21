import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import SubmitReview from "./components/pet_owner/SubmitReview";
import ViewReviews from "./components/caretaker/ViewReviews";
import PetOwnerHome from "./components/pet_owner/PetOwnerHome";
import PetOwnerViewCaretakers from "./components/pet_owner/PetOwnerViewCaretakers";
import CaretakerHome from "./components/caretaker/CaretakerHome";
import CaretakerViewPastJobs from "./components/caretaker/CaretakerViewPastJobs";
import PcsAdminHome from "./components/pcs_admin/PcsAdminHome";

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
    {
      path: "/pet-owners",
      name: "PetOwnerHome",
      component: PetOwnerHome,
    },
    {
      path: "/pet-owners/view-caretakers-profiles",
      name: "PetOwnerViewCaretakers",
      component: PetOwnerViewCaretakers,
    },
    {
      path: "/caretakers",
      name: "CaretakerHome",
      component: CaretakerHome,
    },
    {
      path: "/caretakers/view-past-jobs",
      name: "CaretakerViewPastJobs",
      component: CaretakerViewPastJobs,
    },
    {
      path: "/pcs-admins",
      name: "PcsAdminHome",
      component: PcsAdminHome,
    },
  ],
});
