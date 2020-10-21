<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h2>{{ username }}</h2>
        <br />
        <h3>Edit Personal Information</h3>
        <br />
        <v-layout align-center>
          <v-col>
            <b>Name:</b>
            <v-text-field
              v-model="name"
              label="Enter Name"
              value="name"
              outlined
              clearable
              @click:clear="clearName"
            />
            <br />
            <b>Date of Birth:</b>
            <v-text-field v-model="birth_date" outlined readonly />
            <br />
            <b>Age:</b>
            <v-text-field v-model="age" outlined readonly />
            <b>Gender:</b>
            <v-select
              v-model="gender"
              label="Gender"
              :items="gender_types"
              item-text="name"
              item-value="value"
              outlined
            />
            <b>Phone:</b>
            <v-text-field
              v-model="phone"
              label="Enter Phone Number"
              value="phone"
              outlined
              clearable
              @click:clear="clearPhone"
            />
            <b>Email:</b>
            <v-text-field
              v-model="email"
              label="Enter Email Address"
              value="email"
              outlined
              clearable
              @click:clear="clearEmail"
            />
            <b>Address:</b>
            <v-text-field
              v-model="address"
              label="Enter Address"
              value="address"
              outlined
              clearable
              @click:clear="clearAddress"
            />
          </v-col>
        </v-layout>
        <v-btn icon color="blue" fab @click="submit">
          <v-icon> mdi-content-save</v-icon>
          Save
        </v-btn>
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

export default {
  name: "PetOwnerEditPersonalInfo",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: true,
    username: null,
    name: null,
    age: null,
    birth_date: null,
    gender: null,
    gender_types: [
      { name: "Female", value: "F" },
      { name: "Male", value: "M" },
    ],
    phone: null,
    email: null,
    address: null,
  }),
  methods: {
    clearName: function() {
      this.name = null;
    },
    clearPhone: function() {
      this.phone = null;
    },
    clearEmail: function() {
      this.email = null;
    },
    clearAddress: function() {
      this.address = null;
    },
    submit: function() {
      let data_ok = true;
      if (this.phone != null) {
        if (this.phone.match(/^(9|8|6)[0-9]{7}$/)) {
          var new_phone = '"' + this.phone + '"';
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please provide a valid phone number",
          });
          this.phone = null;
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Phone number cannot be empty",
        });
        data_ok = false;
        this.phone = null;
      }

      if (this.email != null) {
        if (
          this.email.match(
            /^([a-z]|[A-Z])+(!|#|\$|%|&|'|\*|\+|-|\/|\/|=|\?|\^|_|`|\{|\}|\|){0,2}(([a-z]|[A-Z]|[0-9])+)*@([a-z]|[A-Z])+(-)?\.([a-z])+(\.([a-z])+)?$/
          )
        ) {
          var new_email = '"' + this.email + '"';
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please provide a valid email address",
          });
          this.email = null;
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Email cannot be empty",
        });
        data_ok = false;
        this.email = null;
      }

      if (data_ok == true) {
        if (this.name != null) {
          let name_lowercase = this.name.toString().toLowerCase();
          this.name = name_lowercase.replace(
            /(^\w{1})|(\s{1}\w{1})/g,
            (match) => match.toUpperCase()
          );
          var new_name = '"' + this.name + '"';
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Name cannot be empty",
          });
          data_ok = false;
          this.name = null;
        }

        if (this.gender != null) {
          var new_gender = '"' + this.gender + '"';
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Gender cannot be empty",
          });
          data_ok = false;
          this.gender = null;
        }

        if (this.address != null) {
          var new_address = '"' + this.address + '"';
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Address cannot be empty",
          });
          data_ok = false;
          this.address = null;
        }

        const dataToSend =
          '{"name":' +
          new_name +
          ', "gender":' +
          new_gender +
          ', "phone":' +
          new_phone +
          ', "email":' +
          new_email +
          ', "address":' +
          new_address +
          "}";
        console.log(dataToSend);
        const jsonDataToSend = JSON.parse(dataToSend);
        console.log(jsonDataToSend);
        window.location.href = constants.pet_owner_go_back_to_profile_page;
      }
    },
    fetchData: async function() {},
  },
  async mounted() {
    if (document.cookie.includes(";")) {
      let split_cookie = document.cookie.split(";");
      console.log("pet owner username: " + split_cookie[0]);
      var get_last_cookie = split_cookie[0];
    } else {
      get_last_cookie = document.cookie;
    }
    let get_last_cookie_split = get_last_cookie.split("=");
    this.username = get_last_cookie_split[1];
  },
};
</script>
