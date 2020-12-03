<template>
  <v-container>
    <div style="width: 20%; float: left">
      <FullTimeCaretakerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h2>Welcome, {{ username }}!</h2>
        <br />
        <h3>My Profile</h3>
        <br />
        <v-list>
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
          <br />
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
          <br />
          <v-card width="70%">
            <v-card-title style="font-weight:bold;">
              Work Information
            </v-card-title>
            <v-layout align-center>
              <v-card-text>
                Date Started: {{ date_started }} <br />
                Years Of Experience: {{ years_exp }} <br />
                Average Rating: {{ avg_rating }} <br />
                Number of Pets Allowed: {{ num_of_pets }} <br /><br />
                <u>Can Take Care Of</u>
                <v-list v-for="(number, index) in length" :key="index">
                  {{ can_take_care[index] }} - {{ prices[index] }}
                  <br />
                </v-list>
              </v-card-text>
            </v-layout>
          </v-card>
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
import FullTimeCaretakerNavBar from "./FullTimeCaretakerNavBar";
import * as constants from "../constants";
import axios from "axios";

export default {
  name: "FullTimeCaretakerViewMyProfile",

  components: {
    FullTimeCaretakerNavBar,
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
    avg_rating: null,
    years_exp: null,
    date_started: null,
    num_of_pets: 5,
    length: 0,
    can_take_care: [],
    prices: [],
  }),
  methods: {
    editLoginDetails: function() {
      window.location.href =
        constants.full_time_caretaker_edit_login_info + document.cookie;
    },
    editPersonalInfo: function() {
      window.location.href =
        constants.full_time_caretaker_edit_personal_info + document.cookie;
    },
  },
  async mounted() {
    console.log("CT_Profile: " + document.cookie);
    this.username = document.cookie.split("=")[1];

    const get_info = {
      username: this.username,
    };

    await axios
      .post(
        "https://pet-care-service.herokuapp.com/caretakers/get-profile-information",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        this.password = response.data[0].password;
        this.name = response.data[0].name;
        if (response.data[0].age.years != undefined) {
          this.age = response.data[0].age.years + " years ";
        }

        if (response.data[0].age.months != undefined && this.age == null) {
          this.age = response.data[0].age.months + " months ";
        } else if (
          response.data[0].age.months != undefined &&
          this.age != null
        ) {
          this.age += response.data[0].age.months + " months ";
        }

        if (response.data[0].age.days != undefined && this.age == null) {
          this.age = response.data[0].age.days + " days";
        } else if (response.data[0].age.days != undefined && this.age != null) {
          this.age += response.data[0].age.days + " days";
        }

        this.birth_date = response.data[0].birth_date.toString().split("T")[0];
        this.gender = response.data[0].gender;
        this.phone = response.data[0].phone;
        this.email = response.data[0].email;
        this.address = response.data[0].address;
        this.avg_rating = response.data[0].average_rating;
        if (response.data[0].years_exp.years != undefined) {
          this.years_exp = response.data[0].years_exp.years + " years ";
        }

        if (
          response.data[0].years_exp.months != undefined &&
          this.years_exp == null
        ) {
          this.years_exp = response.data[0].years_exp.months + " months ";
        } else if (
          response.data[0].years_exp.months != undefined &&
          this.years_exp != null
        ) {
          this.years_exp += response.data[0].years_exp.months + " months ";
        }

        if (
          response.data[0].years_exp.days != undefined &&
          this.years_exp == null
        ) {
          this.years_exp = response.data[0].years_exp.days + " days";
        } else if (
          response.data[0].years_exp.days != undefined &&
          this.years_exp != null
        ) {
          this.years_exp += response.data[0].years_exp.days + " days";
        }

        // for the case when the user is created today - age is 0 and the object returned from DB is empty
        if (this.years_exp == null) {
          this.years_exp = "0 days";
        }
        console.log("Years: " + this.years_exp);

        this.date_started = response.data[0].date_started
          .toString()
          .split("T")[0];
      });

    await axios
      .post(
        "https://pet-care-service.herokuapp.com/caretakers/get-pets-take-care-information",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        console.log(response.data);
        for (let j = 0; j < response.data.length; j++) {
          let pet_type_mixed = response.data[j].type_name
            .toString()
            .toLowerCase();
          let pet_type = pet_type_mixed.replace(
            /(^\w{1})|(\s{1}\w{1})/g,
            (match) => match.toUpperCase()
          );
          this.can_take_care.push(pet_type);
          let price = "SGD " + response.data[j].current_daily_price.toString();
          this.prices.push(price);
        }
        this.length = response.data.length;
        console.log("Pets: " + this.can_take_care);
        console.log("Prices: " + this.prices);
      });
    this.loaded = true;
  },
};
</script>
