import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import DeleteAccount from "./components/DeleteAccount";
import PetOwnerSubmitReview from "./components/pet_owner/PetOwnerSubmitReview";
import PartTimeCaretakerViewReviews from "./components/part_time_caretaker/PartTimeCaretakerViewReviews";
import PetOwnerViewCaretakers from "./components/pet_owner/PetOwnerViewCaretakers";
import PetOwnerViewCaretakerProfile from "./components/pet_owner/PetOwnerViewCaretakerProfile";
import PetOwnerViewPastJobs from "./components/pet_owner/PetOwnerViewPastJobs";
import PetOwnerViewOngoingJobs from "./components/pet_owner/PetOwnerViewOngoingJobs";
import PetOwnerViewUpcomingJobs from "./components/pet_owner/PetOwnerViewUpcomingJobs";
import PetOwnerViewMyProfile from "./components/pet_owner/PetOwnerViewMyProfile";
import PetOwnerEditLoginInfo from "./components/pet_owner/PetOwnerEditLoginInfo";
import PetOwnerEditPersonalInfo from "./components/pet_owner/PetOwnerEditPersonalInfo";
import PetOwnerAddCreditCardInfo from "./components/pet_owner/PetOwnerAddCreditCardInfo";
import PetOwnerEditCreditCardInfo from "./components/pet_owner/PetOwnerEditCreditCardInfo";
import PetOwnerViewPets from "./components/pet_owner/PetOwnerViewPets";
import PetOwnerAddPetProfile from "./components/pet_owner/PetOwnerAddPetProfile";
import PetOwnerEditPetProfile from "./components/pet_owner/PetOwnerEditPetProfile";
import PetOwnerHome from "./components/pet_owner/PetOwnerHome";
import PartTimeCaretakerHome from "./components/part_time_caretaker/PartTimeCaretakerHome";
import PartTimeCaretakerViewMyProfile from "./components/part_time_caretaker/PartTimeCaretakerViewMyProfile";
import PartTimeCaretakerEditLoginInfo from "./components/part_time_caretaker/PartTimeCaretakerEditLoginInfo";
import PartTimeCaretakerEditPersonalInfo from "./components/part_time_caretaker/PartTimeCaretakerEditPersonalInfo";
import PartTimeCaretakerViewPastJobs from "./components/part_time_caretaker/PartTimeCaretakerViewPastJobs";
import PartTimeCaretakerViewOngoingJobs from "./components/part_time_caretaker/PartTimeCaretakerViewOngoingJobs";
import PartTimeCaretakerViewUpcomingJobs from "./components/part_time_caretaker/PartTimeCaretakerViewUpcomingJobs";
import PartTimeCaretakerViewSalary from "./components/part_time_caretaker/PartTimeCaretakerViewSalary";
import PartTimeCaretakerSetAvailability from "./components/part_time_caretaker/PartTimeCaretakerSetAvailability";
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
      path: "/delete-account",
      name: "DeleteAccount",
      component: DeleteAccount,
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
      path: "/pet-owners/view-my-pets",
      name: "PetOwnerViewPets",
      component: PetOwnerViewPets,
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
      path: "/pet-owners/add-credit-card-information",
      name: "PetOwnerAddCreditCardInfo",
      component: PetOwnerAddCreditCardInfo,
    },
    {
      path: "/pet-owners/edit-credit-card-information",
      name: "PetOwnerEditCreditCardInfo",
      component: PetOwnerEditCreditCardInfo,
    },
    {
      path: "/pet-owners/add-pets",
      name: "PetOwnerAddPetProfile",
      component: PetOwnerAddPetProfile,
    },
    {
      path: "/pet-owners/edit-pet-information",
      name: "PetOwnerEditPetProfile",
      component: PetOwnerEditPetProfile,
    },
    {
      path: "/pet-owner/submit-review", //TODO: change this later
      name: "PetOwnerSubmitReview",
      component: PetOwnerSubmitReview,
    },
    {
      path: "/part-time-caretakers",
      name: "PartTimeCaretakerHome",
      component: PartTimeCaretakerHome,
    },
    {
      path: "/part-time-caretakers/view-my-profile",
      name: "PartTimeCaretakerViewMyProfile",
      component: PartTimeCaretakerViewMyProfile,
    },
    {
      path: "/part-time-caretakers/view-past-jobs",
      name: "PartTimeCaretakerViewPastJobs",
      component: PartTimeCaretakerViewPastJobs,
    },
    {
      path: "/part-time-caretakers/view-ongoing-jobs",
      name: "PartTimeCaretakerViewOngoingJobs",
      component: PartTimeCaretakerViewOngoingJobs,
    },
    {
      path: "/part-time-caretakers/view-upcoming-jobs",
      name: "PartTimeCaretakerViewUpcomingJobs",
      component: PartTimeCaretakerViewUpcomingJobs,
    },
    {
      path: "/part-time-caretakers/edit-login-information",
      name: "PartTimeCaretakerEditLoginInfo",
      component: PartTimeCaretakerEditLoginInfo,
    },
    {
      path: "/part-time-caretakers/edit-personal-information",
      name: "PartTimeCaretakerEditPersonalInfo",
      component: PartTimeCaretakerEditPersonalInfo,
    },
    {
      path: "/part-time-caretakers/view-salary",
      name: "PartTimeCaretakerViewSalary",
      component: PartTimeCaretakerViewSalary,
    },
    {
      path: "/part-time-caretakers/set-availability",
      name: "PartTimeCaretakerSetAvailability",
      component: PartTimeCaretakerSetAvailability,
    },
    {
      path: "/part-time-caretakers/view-reviews", //TODO: change this later
      name: "PartTimeCaretakerViewReviews",
      component: PartTimeCaretakerViewReviews,
    },
    {
      path: "/pcs-admins",
      name: "PcsAdminHome",
      component: PcsAdminHome,
    },
  ],
});
