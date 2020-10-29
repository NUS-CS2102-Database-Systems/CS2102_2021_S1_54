<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h2>Welcome, {{ username }}!</h2>
        <br />
        <h3>My Profile</h3>
        <br />
        <v-list>
          <v-layout align-center>
            <v-card width="70%">
              <v-card-title style="font-weight:bold;">
                Account Login Details
              </v-card-title>
              <v-layout align-center>
                <v-card-text>
                  Username: {{ username }} <br />
                  Password: {{ password }} <br />
                </v-card-text>
                <v-btn icon color="blue" fab @click="editLoginDetails">
                  <v-icon>mdi-pencil</v-icon>
                  Edit
                </v-btn>
              </v-layout>
            </v-card>
          </v-layout>
          <br />
          <v-layout align-center>
            <v-card width="70%">
              <v-card-title style="font-weight:bold;">
                Personal Information
              </v-card-title>
              <v-layout align-center>
                <v-card-text>
                  Name: {{ name }} <br />
                  Date of Birth: {{ birth_date }} <br />
                  Age: {{ age }} <br />
                  Gender: {{ gender }}
                  <br />
                  Phone: {{ phone }}
                  <br />
                  Email: {{ email }} <br />
                  Address: {{ address }} <br />
                </v-card-text>
                <v-btn icon color="blue" fab @click="editPersonalInfo">
                  <v-icon>mdi-pencil</v-icon>
                  Edit
                </v-btn>
              </v-layout>
            </v-card>
          </v-layout>
          <br />
          <v-layout align-center>
            <v-card width="70%">
              <v-card-title style="font-weight:bold;">
                Credit Card Information
                <v-spacer />
                <v-btn icon color="blue" fab @click="addCreditCardInfo">
                  <v-icon>mdi-plus</v-icon>
                  Add
                </v-btn>
                <v-spacer />
                <v-btn icon color="blue" fab @click="editCreditCardInfo">
                  <v-icon>mdi-pencil</v-icon>
                  Edit
                </v-btn>
                <v-spacer />
                <v-btn icon color="blue" fab @click="deleteCreditCardInfo">
                  <v-icon>mdi-delete</v-icon>
                  Delete
                </v-btn>
              </v-card-title>
              <v-layout align-center>
                <v-card-text>
                  Credit Card Number: {{ credit_card_num }} <br />
                  Cardholder's Name: {{ credit_card_name }} <br />
                  Expiry Date: {{ expiry_date }} <br />
                </v-card-text>
              </v-layout>
            </v-card>
          </v-layout>
        </v-list>
      </template>
      <template v-else-if="!loaded">
        <v-row justify="center">
          <v-progress-circular
            indeterminate
            :size="70"
            :width="7"
            color="#01579B"
          />
        </v-row>
      </template>
    </div>
  </v-container>
</template>

<script>
import PetOwnerNavBar from "./PetOwnerNavBar";
import * as constants from "../constants";
import Swal from "sweetalert2";
import axios from "axios";

export default {
  name: "PetOwnerViewMyProfile",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: false,
    username: null,
    password: null,
    name: null,
    age: null,
    birth_date: null,
    gender: null,
    phone: null,
    email: null,
    address: null,
    credit_card_num: null,
    credit_card_name: null,
    expiry_date: null,
  }),
  methods: {
    editLoginDetails: function() {
      window.location.href =
        constants.pet_owner_edit_login_info + document.cookie;
    },
    editPersonalInfo: function() {
      window.location.href =
        constants.pet_owner_edit_personal_info + document.cookie;
    },
    addCreditCardInfo: function() {
      if (this.credit_card_num == null) {
        window.location.href =
          constants.pet_owner_add_credit_card_info + document.cookie;
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Sorry! Only 1 credit card is allowed per pet owner!",
        });
      }
    },
    editCreditCardInfo: function() {
      window.location.href =
        constants.pet_owner_edit_credit_card_info + document.cookie;
    },
    deleteCreditCardInfo: async function() {
      if (this.credit_card_num == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Sorry! There is no credit card information to delete!",
        });
      } else {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            // axios to delete info
            const info_delete = {
              username: this.username,
            };

            await axios
              .post("/pet-owners/delete-credit-card-information", {
                toDelete: info_delete,
              })
              .then((response) => {
                if (
                  response.data[0].credit_card_full_name == null &&
                  response.data[0].credit_card_number == null &&
                  response.data[0].credit_card_expiry_date == null
                ) {
                  Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text:
                      "Credit Card information has been deleted successfully.",
                  });
                  window.location.reload();
                }
              });
          }
        });
      }
    },
  },
  async mounted() {
    console.log("C_Profile: " + document.cookie);
    this.username = document.cookie.split("=")[1];
    const get_info = {
      username: this.username,
    };

    await axios
      .post("/pet-owners/get-profile-information", {
        toGet: get_info,
      })
      .then((response) => {
        this.password = response.data[0].password;
        this.name = response.data[0].name;
        this.age = response.data[0].age;
        this.birth_date = response.data[0].birth_date;
        this.gender = response.data[0].gender;
        this.phone = response.data[0].phone;
        this.email = response.data[0].email;
        this.address = response.data[0].address;
        this.credit_card_num = response.data[0].credit_card_number;
        this.credit_card_name = response.data[0].credit_card_full_name;
        this.expiry_date = response.data[0].credit_card_expiry_date;
      });
    this.loaded = true;
  },
};
</script>
