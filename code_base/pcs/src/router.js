import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import DeleteAccount from "./components/DeleteAccount";
import PetOwnerSubmitReview from "./components/pet_owner/PetOwnerSubmitReview";
import PetOwnerViewCaretakers from "./components/pet_owner/PetOwnerViewCaretakers";
import PetOwnerBidCaretaker from "./components/pet_owner/PetOwnerBidCaretaker";
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
import FullTimeCaretakerHome from "./components/full_time_caretaker/FullTimeCaretakerHome";
import FullTimeCaretakerViewMyProfile from "./components/full_time_caretaker/FullTimeCaretakerViewMyProfile";
import FullTimeCaretakerEditLoginInfo from "./components/full_time_caretaker/FullTimeCaretakerEditLoginInfo";
import FullTimeCaretakerEditPersonalInfo from "./components/full_time_caretaker/FullTimeCaretakerEditPersonalInfo";
import FullTimeCaretakerViewPastJobs from "./components/full_time_caretaker/FullTimeCaretakerViewPastJobs";
import FullTimeCaretakerViewOngoingJobs from "./components/full_time_caretaker/FullTimeCaretakerViewOngoingJobs";
import FullTimeCaretakerViewUpcomingJobs from "./components/full_time_caretaker/FullTimeCaretakerViewUpcomingJobs";
import FullTimeCaretakerViewSalary from "./components/full_time_caretaker/FullTimeCaretakerViewSalary";
import PetOwnerViewCaretakerReviews from "./components/pet_owner/PetOwnerViewCaretakerReviews";
import FullTimeCaretakerApplyForLeave from "./components/full_time_caretaker/FullTimeCaretakerApplyForLeave";
import FullTimeCaretakerViewLeaves from "./components/full_time_caretaker/FullTimeCaretakerViewLeaves";
import PcsAdminSetBaseDailyPrice from "./components/pcs_admin/PcsAdminSetBaseDailyPrice";
import PcsAdminHome from "./components/pcs_admin/PcsAdminHome";
import PcsAdminViewNumOfPetsCaredByEachCaretaker from "./components/pcs_admin/PcsAdminViewNumOfPetsCaredByEachCaretaker";
import AdminSignUp from "./components/AdminSignUp";
import PcsAdminViewMyProfile from "./components/pcs_admin/PcsAdminViewMyProfile";
import PcsAdminEditLoginInfo from "./components/pcs_admin/PcsAdminEditLoginInfo";


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
      path: "/pet-owners/home",
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
      path: "/pet-owners/view-caretakers-profiles/bid",
      name: "PetOwnerBidCaretaker",
      component: PetOwnerBidCaretaker,
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
      // path: "/pet-owners/submit-review/:pusername&:cusername&:pet_name&:job_start_datetime&:job_end_datetime",
      path: "/pet-owners/submit-review",
      name: "PetOwnerSubmitReview",
      component: PetOwnerSubmitReview,
      // props: true
    },
    {
      path: "/part-time-caretakers",
      name: "PartTimeCaretakerHome",
      component: PartTimeCaretakerHome,
    },
    {
      path: "/part-time-caretakers/home",
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
      path: "/full-time-caretakers",
      name: "FullTimeCaretakerHome",
      component: FullTimeCaretakerHome,
    },
    {
      path: "/full-time-caretakers/home",
      name: "FullTimeCaretakerHome",
      component: FullTimeCaretakerHome,
    },
    {
      path: "/full-time-caretakers/view-my-profile",
      name: "FullTimeCaretakerViewMyProfile",
      component: FullTimeCaretakerViewMyProfile,
    },
    {
      path: "/full-time-caretakers/edit-login-information",
      name: "FullTimeCaretakerEditLoginInfo",
      component: FullTimeCaretakerEditLoginInfo,
    },
    {
      path: "/full-time-caretakers/edit-personal-information",
      name: "FullTimeCaretakerEditPersonalInfo",
      component: FullTimeCaretakerEditPersonalInfo,
    },
    {
      path: "/full-time-caretakers/view-past-jobs",
      name: "FullTimeCaretakerViewPastJobs",
      component: FullTimeCaretakerViewPastJobs,
    },
    {
      path: "/full-time-caretakers/view-ongoing-jobs",
      name: "FullTimeCaretakerViewOngoingJobs",
      component: FullTimeCaretakerViewOngoingJobs,
    },
    {
      path: "/full-time-caretakers/view-upcoming-jobs",
      name: "FullTimeCaretakerViewUpcomingJobs",
      component: FullTimeCaretakerViewUpcomingJobs,
    },
    {
      path: "/full-time-caretakers/view-salary",
      name: "FullTimeCaretakerViewSalary",
      component: FullTimeCaretakerViewSalary,
    },
    {
      path: "/pcs-admin",
      name: "PcsAdminHome",
      component: PcsAdminHome,
    },
    {
      path: "/pcs-admin/home",
      name: "PcsAdminHome",
      component: PcsAdminHome,
    },
    {
      path: "/pcs-admin/view-my-profile",
      name: "PcsAdminViewMyProfile",
      component: PcsAdminViewMyProfile,
    },
    {
      path: "/pcs-admin/edit-login-information",
      name: "PcsAdminEditLoginInfo",
      component: PcsAdminEditLoginInfo,
    },
    {
      path: "/pcs-admin/view-number-of-pets-cared-for-per-caretaker",
      name: "PcsAdminViewNumOfPetsCaredByEachCaretaker",
      component: PcsAdminViewNumOfPetsCaredByEachCaretaker,
    },
    {
<<<<<<< HEAD
      path: "/pcs-admins/set-base-daily-price",
      name: "PcsAdminSetBaseDailyPrice",
      component: PcsAdminSetBaseDailyPrice,
    },
    {      
=======
>>>>>>> a5b3bafdfc5e1f90681cf31d7e9cb6c8d56bac9d
      path: "/admin-signup",
      name: "AdminSignUp",
      component: AdminSignUp,
    },
    {
      path: "/pet-owners/view-caretaker-reviews/:caretaker_username",
      name: "PetOwnersViewCaretakerReviews",
      component: PetOwnerViewCaretakerReviews,
      props: true,
    },
    {
      path: "/full-time-caretakers/apply-for-leave",
      name: "FullTimeCaretakerApplyForLeave",
      component: FullTimeCaretakerApplyForLeave,
    },
    {
      path: "/full-time-caretakers/view-leaves",
      name: "FullTimeCaretakerViewLeaves",
      component: FullTimeCaretakerViewLeaves,
    },
  ],
});
