import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import DeleteAccount from "./components/DeleteAccount";
import SubmitReview from "./components/pet_owner/SubmitReview";
import ViewReviews from "./components/caretaker/ViewReviews";
import PetOwnerViewCaretakers from "./components/pet_owner/PetOwnerViewCaretakers";
import CaretakerHome from "./components/caretaker/CaretakerHome";
import CaretakerViewPastJobs from "./components/caretaker/CaretakerViewPastJobs";
import PcsAdminHome from "./components/pcs_admin/PcsAdminHome";
import PetOwnerViewCaretakerProfile from "./components/pet_owner/PetOwnerViewCaretakerProfile";
import PetOwnerViewPastJobs from "./components/pet_owner/PetOwnerViewPastJobs";
import PetOwnerViewOngoingJobs from "./components/pet_owner/PetOwnerViewOngoingJobs";
import PetOwnerViewUpcomingJobs from "./components/pet_owner/PetOwnerViewUpcomingJobs";
import PetOwnerViewMyProfile from "./components/pet_owner/PetOwnerViewMyProfile";
import PetOwnerEditLoginInfo from "./components/pet_owner/PetOwnerEditLoginInfo";
import PetOwnerEditPersonalInfo from "./components/pet_owner/PetOwnerEditPersonalInfo";
import PetOwnerEditCreditCardInfo from "./components/pet_owner/PetOwnerEditCreditCardInfo";
import PetOwnerHome from "./components/pet_owner/PetOwnerHome";

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
      path: "/delete-account",
      name: "DeleteAccount",
      component: DeleteAccount,
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
      path: "/pet-owners/view-past-jobs",
      name: "PetOwnerViewPastJobs",
      component: PetOwnerViewPastJobs,
    },
    {
      path: "/pet-owners/view-ongoing-jobs",
      name: "PetOwnerViewOngoingJobs",
      component: PetOwnerViewOngoingJobs,
    },
    {
      path: "/pet-owners/view-upcoming-jobs",
      name: "PetOwnerViewUpcomingJobs",
      component: PetOwnerViewUpcomingJobs,
    },
    {
      path: "/pet-owners/view-caretakers-profiles",
      name: "PetOwnerViewCaretakers",
      component: PetOwnerViewCaretakers,
    },
    {
      path: "/pet-owners/view-caretakers-profiles/caretaker",
      name: "PetOwnerViewCaretakerProfile",
      component: PetOwnerViewCaretakerProfile,
    },
    {
      path: "/pet-owners/view-my-profile",
      name: "PetOwnerViewMyProfile",
      component: PetOwnerViewMyProfile,
    },
    {
      path: "/pet-owners/edit-login-information",
      name: "PetOwnerEditLoginInfo",
      component: PetOwnerEditLoginInfo,
    },
    {
      path: "/pet-owners/edit-personal-information",
      name: "PetOwnerEditPersonalInfo",
      component: PetOwnerEditPersonalInfo,
    },
    {
      path: "/pet-owners/edit-credit-card-information",
      name: "PetOwnerEditCreditCardInfo",
      component: PetOwnerEditCreditCardInfo,
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
