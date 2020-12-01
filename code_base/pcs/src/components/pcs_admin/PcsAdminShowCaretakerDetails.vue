<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PcsAdminNavBar />
    </div>
    <div style="width: 80%; float: right">
      <h1>Viewing Caretaker's Details</h1>
      <template v-if="loaded">
        <br />
        <v-list>
          <v-card width="70%">
            <v-card-title style="font-weight:bold;">
              Personal Information
            </v-card-title>
            <v-layout align-center>
              <v-card-text>
                Username: {{ caretaker_username }} <br />
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
                  <v-btn elevation="2">
                    <router-link
                      tag="span"
                      :to="{
                        path:
                          '/pcs-admin/view-caretaker-reviews/' +
                          caretaker_username,
                      }"
                    >
                      View Reviews
                    </router-link>
                  </v-btn>
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
import PcsAdminNavBar from "./PcsAdminNavBar";
import axios from "axios";

export default {
  name: "PcsAdminShowCaretakerDetails",
  components: {
    PcsAdminNavBar,
  },
  data: () => ({
    loaded: false,
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
    num_of_pets: null,
    length: 0,
    can_take_care: [],
    prices: [],
  }),
  async mounted() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.caretaker_username = urlParams.get("caretaker_username");
    console.log(this.caretaker_username);

    const get_info = {
      username: this.caretaker_username,
    };

    await axios
      .post(
        "https://pet-care-service.herokuapp.com/pcs-admin/caretaker-details",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        console.log(response.data[0]);
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
        this.num_of_pets = response.data[0].num_pets_allowed;
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
