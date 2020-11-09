<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <v-btn depressed color="primary" @click="addABid('hey')">
        Place a Bid
      </v-btn>

      <v-row>
        <v-col class="mx-auto" md="2">
          <v-select
            v-model="selected_commitment_level"
            :items="commitment_levels"
            item-text="name"
            item-value="value"
            label="Commitment"
            prepend-icon="mdi-account"
            filled
            clearable
            dense
            color="#000000"
            @input="selectCommitmentLevel"
            @click:clear="clearCommitmentLevel"
          />
        </v-col>
        <v-col class="mx-auto" md="3">
          <v-menu
            v-model="available_dates"
            :nudge-right="40"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                label="Availability"
                :value="dateDisplay"
                v-on="on"
                clearable
                prepend-icon="mdi-calendar"
                filled
                dense
                color="#000000"
                @click:clear="clearDates"
              />
            </template>
            <v-date-picker
              v-model="selected_available_dates"
              @click:date="selectDates"
              range
            />
          </v-menu>
        </v-col>
        <v-col class="mx-auto" md="2">
          <v-select
            v-model="selected_rating"
            :items="rating_types"
            item-text="name"
            item-value="value"
            label="Rating"
            prepend-icon="mdi-magnify"
            filled
            clearable
            dense
            color="#000000"
            @input="selectRating"
            @click:clear="clearRating"
          />
        </v-col>
        <v-col class="mx-auto" md="2">
          <v-text-field
            v-model="selected_price_from"
            label="Min. Price"
            prepend-icon="mdi-currency-usd"
            filled
            clearable
            dense
            color="#000000"
            @input="minimumPrice"
            @click:clear="clearMinimumPrice"
          />
        </v-col>
        <v-col class="mx-auto" md="2">
          <v-text-field
            v-model="selected_price_to"
            label="Max. Price"
            prepend-icon="mdi-currency-usd"
            filled
            clearable
            dense
            color="#000000"
            @input="maximumPrice"
            @click:clear="clearMaximumPrice"
          />
        </v-col>
        <v-col class="mx-auto" md="3">
          <v-select
            v-model="selected_sort_by"
            :items="sort_by"
            item-text="name"
            item-value="value"
            label="Sort By"
            prepend-icon="mdi-sort-variant"
            filled
            clearable
            multiple
            dense
            color="#000000"
            @input="selectSortBy"
            @click:clear="clearSortBy"
          />
        </v-col>
        <v-col class="mx-auto" md="3">
          <v-text-field
            v-model="search"
            clearable
            filled
            label="Search Caretaker Username"
            prepend-icon="mdi-magnify"
            @click:clear="clearSearch"
          />
        </v-col>
        <v-col class="mx-auto" md="3">
          <v-select
            v-model="selected_pet_type"
            :items="pet_types"
            item-text="name"
            item-value="value"
            label="Type of Animal"
            prepend-icon="mdi-github"
            filled
            clearable
            multiple
            dense
            color="#000000"
            @input="selectPetType"
            @click:clear="clearPetType"
          />
        </v-col>
        <v-col class="mx-auto" md="1">
          <v-btn icon color="blue" fab outlined @click="submit">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <template v-if="have_data && loaded">
        <v-row>
          <v-col class="mx-auto">
            <v-list v-for="i in length_odd" :key="i">
              <v-row>
                <v-card width="55%">
                  <v-card-title
                    >{{ caretaker_username_odd[i - 1] }}
                  </v-card-title>
                  <v-btn
                    depressed
                    color="primary"
                    @click="addABid(caretaker_username_odd[i - 1])"
                  >
                    Place a Bid
                  </v-btn>
                  <v-card-text>
                    <p style="color:black">
                      Name: {{ caretaker_name_odd[i - 1] }} <br />
                      Date of Birth: {{ caretaker_date_of_birth_odd[i - 1] }}
                      <br />
                      Age: {{ caretaker_age_odd[i - 1] }} <br />
                      Gender: {{ caretaker_gender_odd[i - 1] }} <br />
                      Years of Experience:
                      {{ caretaker_years_exp_odd[i - 1] }}
                      <br />
                      Phone: {{ caretaker_phone_odd[i - 1] }} <br />
                      Email: {{ caretaker_email_odd[i - 1] }}
                      <br />
                      Address: {{ caretaker_address_odd[i - 1] }}
                      <br />
                      Average Rating: {{ caretaker_avg_rating_odd[i - 1] }}
                      <br />
                      Can Take Care of:
                      {{ caretaker_take_care_animals_odd[i - 1] }}
                      <!-- <v-list v-for="i in animals_length_odd" :key="i">
                      {{ caretaker_take_care_animals_odd[i] }}
                      <br />
                    </v-list> -->
                      <br />
                      <v-btn elevation="2">
                        <router-link
                          tag="span"
                          :to="{
                            path:
                              '/pet-owners/view-caretaker-reviews/' +
                              caretaker_username_odd[i - 1],
                          }"
                        >
                          View Reviews
                        </router-link>
                      </v-btn>
                    </p>
                  </v-card-text>
                </v-card>
              </v-row>
            </v-list>
          </v-col>
          <v-col class="mx-auto">
            <v-list v-for="i in length_even" :key="i">
              <v-row>
                <v-card width="55%">
                  <v-card-title
                    >{{ caretaker_username_even[i - 1] }}
                  </v-card-title>
                  <v-btn
                    depressed
                    color="primary"
                    @click="addABid(caretaker_username_even[i - 1])"
                  >
                    Place a Bid
                  </v-btn>
                  <v-card-text>
                    <p style="color:black">
                      Name: {{ caretaker_name_even[i - 1] }} <br />
                      Date of Birth: {{ caretaker_date_of_birth_even[i - 1] }}
                      <br />
                      Age: {{ caretaker_age_even[i - 1] }} <br />
                      Gender: {{ caretaker_gender_even[i - 1] }} <br />
                      Years of Experience:
                      {{ caretaker_years_exp_even[i - 1] }}
                      <br />
                      Phone: {{ caretaker_phone_even[i - 1] }} <br />
                      Email: {{ caretaker_email_even[i - 1] }}
                      <br />
                      Address: {{ caretaker_address_even[i - 1] }}
                      <br />
                      Average Rating: {{ caretaker_avg_rating_even[i - 1] }}
                      <br />
                      Can Take Care of:
                      {{ caretaker_take_care_animals_even[i - 1] }}
                      <!-- <v-list v-for="i in animals_length_even" :key="i">
                      {{ caretaker_take_care_animals_even[i] }}
                      <br />
                    </v-list> -->
                      <br />
                      <v-btn elevation="2">
                        <router-link
                          tag="span"
                          :to="{
                            path:
                              '/pet-owners/view-caretaker-reviews/' +
                              caretaker_username_even[i],
                          }"
                        >
                          View Reviews
                        </router-link>
                      </v-btn>
                    </p>
                  </v-card-text>
                </v-card>
              </v-row>
            </v-list>
          </v-col>
        </v-row>
      </template>
      <template v-else-if="!have_data && loaded">
        <v-row>
          <v-card
            class="mx-auto"
            width="60%"
            height="160"
            color="#ECEFF1"
            rounded
          >
            <v-card-title>
              <v-row align="center" justify="center">
                <v-icon light large center>mdi-emoticon-sad</v-icon>
              </v-row>
            </v-card-title>
            <p class="text-center">
              What you are looking for cannot be found.
              <br />Sorry!
            </p>
          </v-card>
        </v-row>
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
  name: "PetOwnerViewCaretakers",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    username: null,
    commitment_levels: [
      { name: "Full-time", value: "full-time" },
      { name: "Part-time", value: "part-time" },
    ],
    rating_types: [
      { name: "0 & Up", value: "0" },
      { name: "1 & Up", value: "1" },
      { name: "2 & Up", value: "2" },
      { name: "3 & Up", value: "3" },
      { name: "4 & Up", value: "4" },
    ],
    sort_by: [
      { name: "Alphabetical A to Z", value: "alphabetical a to z" },
      { name: "Alphabetical Z to A", value: "alphabetical z to a" },
      { name: "Price Low to High", value: "price low to high" },
      { name: "Price High to Low", value: "price high to low" },
    ],
    pet_types: [
      { name: "Big Dog", value: "big dog" },
      { name: "Bird", value: "bird" },
      { name: "Cat", value: "cat" },
      { name: "Rodent", value: "rodent" },
      { name: "Rabbit", value: "rabbit" },
      { name: "Small Dog", value: "small dog" },
    ],
    available_dates: false,
    search: null,
    rating: null,
    price_from: null,
    price_to: null,
    have_data: true,
    loaded: false,
    length_even: 0,
    length_odd: 0,
    animals_length_odd: 0,
    animals_length_even: 0,
    caretaker_username_even: [],
    caretaker_name_even: [],
    caretaker_age_even: [],
    caretaker_date_of_birth_even: [],
    caretaker_gender_even: [],
    caretaker_phone_even: [],
    caretaker_email_even: [],
    caretaker_address_even: [],
    caretaker_avg_rating_even: [],
    caretaker_years_exp_even: [],
    caretaker_take_care_animals_even: [],
    caretaker_username_odd: [],
    caretaker_name_odd: [],
    caretaker_age_odd: [],
    caretaker_date_of_birth_odd: [],
    caretaker_gender_odd: [],
    caretaker_phone_odd: [],
    caretaker_email_odd: [],
    caretaker_address_odd: [],
    caretaker_avg_rating_odd: [],
    caretaker_years_exp_odd: [],
    caretaker_take_care_animals_odd: [],
    selected_commitment_level: null,
    selected_available_dates: null,
    selected_rating: null,
    selected_sort_by: null,
    selected_price_from: null,
    selected_price_to: null,
    selected_pet_type: null,
  }),
  computed: {
    dateDisplay() {
      return this.selected_available_dates;
    },
  },
  methods: {
    addABid: function(caretaker_username) {
      let caretaker_username_to_bid = "&caretaker=" + caretaker_username;
      window.location.href =
        constants.pet_owner_submit_bid_for_caretaker +
        document.cookie +
        caretaker_username_to_bid;
    },
    selectCommitmentLevel: function() {
      console.log(this.selected_commitment_level);
    },
    clearCommitmentLevel: function() {
      this.selected_commitment_level = null;
    },
    selectDates: function() {
      this.selected_available_dates = this.selected_available_dates.sort();
      console.log(this.selected_available_dates);
    },
    clearDates: function() {
      this.selected_available_dates = null;
    },
    selectRating: function() {
      console.log(this.selected_rating);
    },
    clearRating: function() {
      this.selected_rating = null;
    },
    minimumPrice: function() {
      console.log(this.selected_price_from);
    },
    clearMinimumPrice: function() {
      this.selected_price_from = null;
    },
    maximumPrice: function() {
      console.log(this.selected_price_to);
    },
    clearMaximumPrice: function() {
      this.selected_price_to = null;
    },
    selectSortBy: function() {
      console.log(this.selected_sort_by);
      if (
        this.selected_sort_by.includes("alphabetical a to z") &&
        this.selected_sort_by.includes("alphabetical z to a")
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Can sort in Ascending or Descending order, not both",
        });
        this.selected_sort_by.pop();
      }

      if (
        this.selected_sort_by.includes("price low to high") &&
        this.selected_sort_by.includes("price high to low")
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Can sort in Ascending or Descending order, not both",
        });
        this.selected_sort_by.pop();
      }
    },
    clearSearch: function() {
      this.search = null;
    },
    clearSortBy: function() {
      this.selected_sort_by = null;
    },
    selectPetType: function() {
      console.log(this.selected_pet_type);
    },
    clearPetType: function() {
      this.selected_pet_type = null;
      console.log(this.selected_pet_type);
    },
    submit: async function() {
      let data_ok = true;

      if (this.selected_commitment_level != null) {
        var commitment_level = '"' + this.selected_commitment_level + '"';
      } else {
        commitment_level = null;
      }

      if (this.selected_sort_by != null) {
        if (this.selected_sort_by.length > 0) {
          this.selected_sort_by = this.selected_sort_by.sort();
          var order_by = '"';
          for (let k = 0; k < this.selected_sort_by.length; k++) {
            order_by += this.selected_sort_by[k] + ",";
          }
          order_by = order_by.slice(0, -1);
          order_by += '"';
        } else {
          order_by = null;
        }
      } else {
        order_by = null;
      }

      if (this.selected_price_from != null) {
        var min_price = '"' + this.selected_price_from + '"';
      } else {
        min_price = null;
      }

      if (this.selected_price_to != null) {
        var max_price = '"' + this.selected_price_to + '"';
      } else {
        max_price = null;
      }

      if (min_price > max_price && min_price != null && max_price != null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Maximum Price must be greater than Minimum Price",
        });
        this.selected_price_to = null;
        data_ok = false;
      }

      if (this.selected_available_dates != null) {
        if (this.selected_available_dates.length == 1) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please provide a range of dates (start date and end date)",
          });
          this.selected_available_dates = null;
          data_ok = false;
        } else {
          var dates =
            '"' +
            this.selected_available_dates[0] +
            "," +
            this.selected_available_dates[1] +
            '"';
        }
      } else {
        dates = null;
      }

      if (this.selected_rating != null) {
        var rating_wanted = '"' + this.selected_rating + '"';
      } else {
        rating_wanted = null;
      }

      if (this.selected_pet_type != null) {
        if (this.selected_pet_type.length > 0) {
          this.selected_pet_type = this.selected_pet_type.sort();
          console.log("pet type: " + this.selected_pet_type);
          var animal_type = '"';
          for (let m = 0; m < this.selected_pet_type.length; m++) {
            animal_type += this.selected_pet_type[m] + ",";
          }

          if (animal_type.includes(",")) {
            animal_type = animal_type.slice(0, -1);
          }
          animal_type += '"';
        } else {
          animal_type = null;
        }
      } else {
        animal_type = null;
      }

      if (this.search != null) {
        var search_caretaker = '"' + this.search + '"';
      } else {
        search_caretaker = null;
      }

      if (data_ok == true) {
        const dataToSend =
          '{"commitment":' +
          commitment_level +
          ', "dates":' +
          dates +
          ', "rating":' +
          rating_wanted +
          ', "order_by":' +
          order_by +
          ', "start_price":' +
          min_price +
          ', "end_price":' +
          max_price +
          ', "caretaker_username":' +
          search_caretaker +
          ', "animal_type":' +
          animal_type +
          "}";

        console.log(dataToSend);
        let jsonDataToSend = JSON.parse(dataToSend);
        console.log(jsonDataToSend);

        await axios
          .post(
            "https://pet-care-service.herokuapp.com/pet-owners/get-specific-caretakers-information",
            {
              caretaker: jsonDataToSend,
            }
          )
          .then((response) => {
            this.caretaker_username_odd = [];
            this.caretaker_name_odd = [];
            this.caretaker_age_odd = [];
            this.caretaker_date_of_birth_odd = [];
            this.caretaker_gender_odd = [];
            this.caretaker_phone_odd = [];
            this.caretaker_address_odd = [];
            this.caretaker_email_odd = [];
            this.caretaker_avg_rating_odd = [];
            this.caretaker_years_exp_odd = [];
            this.caretaker_take_care_animals_odd = [];
            this.caretaker_username_even = [];
            this.caretaker_name_even = [];
            this.caretaker_age_even = [];
            this.caretaker_date_of_birth_even = [];
            this.caretaker_gender_even = [];
            this.caretaker_phone_even = [];
            this.caretaker_email_even = [];
            this.caretaker_address_even = [];
            this.caretaker_avg_rating_even = [];
            this.caretaker_years_exp_even = [];
            this.caretaker_take_care_animals_even = [];
            this.length_even = 0;
            this.length_odd = 0;
            this.loaded = false;
            this.have_data = false;
            console.log("Axios");
            console.log(response.data);
            if (response.data.length == 0) {
              this.have_data = false;
              this.loaded = true;
            } else {
              this.have_data = true;
              for (let i = 0; i < response.data.length; i++) {
                if (i % 2 == 0) {
                  this.length_odd += 1;
                  this.caretaker_username_odd.push(response.data[i].username);
                  this.caretaker_name_odd.push(response.data[i].name);
                  let age = "";

                  if (response.data[0].age.months != undefined && age == null) {
                    age = response.data[0].age.months + " months ";
                  } else if (
                    response.data[0].age.months != undefined &&
                    age != null
                  ) {
                    age += response.data[0].age.months + " months ";
                  }

                  if (response.data[0].age.days != undefined && age == null) {
                    age = response.data[0].age.days + " days";
                  } else if (
                    response.data[0].age.days != undefined &&
                    age != null
                  ) {
                    age += response.data[0].age.days + " days";
                  }
                  this.caretaker_age_odd.push(age);
                  this.caretaker_date_of_birth_odd.push(
                    response.data[i].birth_date.toString().split("T")[0]
                  );
                  this.caretaker_gender_odd.push(response.data[i].gender);
                  this.caretaker_phone_odd.push(response.data[i].phone);
                  this.caretaker_email_odd.push(response.data[i].email);
                  this.caretaker_address_odd.push(response.data[i].address);
                  this.caretaker_avg_rating_odd.push(
                    response.data[i].average_rating
                  );

                  let years = null;
                  if (response.data[0].years_exp.years != undefined) {
                    years = response.data[0].years_exp.years + " years ";
                  }

                  if (
                    response.data[0].years_exp.months != undefined &&
                    years == null
                  ) {
                    years = response.data[0].years_exp.months + " months ";
                  } else if (
                    response.data[0].years_exp.months != undefined &&
                    years != null
                  ) {
                    years += response.data[0].years_exp.months + " months ";
                  }

                  if (
                    response.data[0].years_exp.days != undefined &&
                    years == null
                  ) {
                    years = response.data[0].years_exp.days + " days";
                  } else if (
                    response.data[0].years_exp.days != undefined &&
                    years != null
                  ) {
                    years += response.data[0].years_exp.days + " days";
                  }
                  this.caretaker_years_exp_odd.push(years);

                  const get_info = {
                    username: response.data[i].username,
                  };

                  axios
                    .post(
                      "https://pet-care-service.herokuapp.com/pet-owners/get-caretaker-pets-information",
                      {
                        toGet: get_info,
                      }
                    )
                    .then((response) => {
                      let pet_length = response.data.length;
                      let pets_can = [];
                      for (let j = 0; j < pet_length; j++) {
                        pets_can.push(response.data[j].type_name);
                        let price = "$" + response.data[j].current_daily_price;
                        pets_can.push(price);
                      }
                      this.caretaker_take_care_animals_odd.push(pets_can);
                      this.animals_length_odd += 1;
                    });
                } else {
                  this.length_even += 1;
                  this.caretaker_username_even.push(response.data[i].username);
                  this.caretaker_name_even.push(response.data[i].name);
                  let age = null;

                  if (response.data[0].age.months != undefined && age == null) {
                    age = response.data[0].age.months + " months ";
                  } else if (
                    response.data[0].age.months != undefined &&
                    age != null
                  ) {
                    age += response.data[0].age.months + " months ";
                  }

                  if (response.data[0].age.days != undefined && age == null) {
                    age = response.data[0].age.days + " days";
                  } else if (
                    response.data[0].age.days != undefined &&
                    age != null
                  ) {
                    age += response.data[0].age.days + " days";
                  }
                  this.caretaker_age_even.push(age);
                  this.caretaker_date_of_birth_even.push(
                    response.data[i].birth_date.toString().split("T")[0]
                  );
                  this.caretaker_gender_even.push(response.data[i].gender);
                  this.caretaker_phone_even.push(response.data[i].phone);
                  this.caretaker_email_even.push(response.data[i].email);
                  this.caretaker_address_even.push(response.data[i].address);
                  this.caretaker_avg_rating_even.push(
                    response.data[i].average_rating
                  );
                  let years = null;
                  if (response.data[0].years_exp.years != undefined) {
                    years = response.data[0].years_exp.years + " years ";
                  }

                  if (
                    response.data[0].years_exp.months != undefined &&
                    years == null
                  ) {
                    years = response.data[0].years_exp.months + " months ";
                  } else if (
                    response.data[0].years_exp.months != undefined &&
                    years != null
                  ) {
                    years += response.data[0].years_exp.months + " months ";
                  }

                  if (
                    response.data[0].years_exp.days != undefined &&
                    years == null
                  ) {
                    years = response.data[0].years_exp.days + " days";
                  } else if (
                    response.data[0].years_exp.days != undefined &&
                    years != null
                  ) {
                    years += response.data[0].years_exp.days + " days";
                  }
                  this.caretaker_years_exp_even.push(years);

                  const get_pet_info = {
                    username: response.data[i].username,
                  };
                  axios
                    .post(
                      "https://pet-care-service.herokuapp.com/pet-owners/get-caretaker-pets-information",
                      {
                        toGet: get_pet_info,
                      }
                    )
                    .then((response) => {
                      let pet_length = response.data.length;
                      let pets_can = [];
                      for (let j = 0; j < pet_length; j++) {
                        pets_can.push(response.data[j].type_name);
                        let price = "$" + response.data[j].current_daily_price;
                        pets_can.push(price);
                      }
                      this.caretaker_take_care_animals_even.push(pets_can);
                      this.animals_length_even += 1;
                    });
                }
              }
              this.loaded = true;
            }
          });
      }
    },
  },
  async mounted() {
    console.log("Doc Caretaker: " + document.cookie);
    this.username = document.cookie.split("=")[1];

    await axios
      .get(
        "https://pet-care-service.herokuapp.com/pet-owners/get-caretakers-information"
      )
      .then((response) => {
        let length = response.data.length;
        if (length == 0) {
          this.have_data = false;
        } else {
          this.have_data = true;
          for (let i = 0; i < length; i++) {
            if (i % 2 == 0) {
              this.length_odd += 1;
              this.caretaker_username_odd.push(response.data[i].username);
              this.caretaker_name_odd.push(response.data[i].name);
              let age = null;

              if (response.data[0].age.months != undefined && age == null) {
                age = response.data[0].age.months + " months ";
              } else if (
                response.data[0].age.months != undefined &&
                age != null
              ) {
                age += response.data[0].age.months + " months ";
              }

              if (response.data[0].age.days != undefined && age == null) {
                age = response.data[0].age.days + " days";
              } else if (
                response.data[0].age.days != undefined &&
                age != null
              ) {
                age += response.data[0].age.days + " days";
              }
              this.caretaker_age_odd.push(age);
              this.caretaker_date_of_birth_odd.push(
                response.data[i].birth_date.toString().split("T")[0]
              );
              this.caretaker_gender_odd.push(response.data[i].gender);
              this.caretaker_phone_odd.push(response.data[i].phone);
              this.caretaker_email_odd.push(response.data[i].email);
              this.caretaker_address_odd.push(response.data[i].address);
              this.caretaker_avg_rating_odd.push(
                response.data[i].average_rating
              );
              let years = null;
              if (response.data[0].years_exp.years != undefined) {
                years = response.data[0].years_exp.years + " years ";
              }

              if (
                response.data[0].years_exp.months != undefined &&
                years == null
              ) {
                years = response.data[0].years_exp.months + " months ";
              } else if (
                response.data[0].years_exp.months != undefined &&
                years != null
              ) {
                years += response.data[0].years_exp.months + " months ";
              }

              if (
                response.data[0].years_exp.days != undefined &&
                years == null
              ) {
                years = response.data[0].years_exp.days + " days";
              } else if (
                response.data[0].years_exp.days != undefined &&
                years != null
              ) {
                years += response.data[0].years_exp.days + " days";
              }
              this.caretaker_years_exp_odd.push(years);

              const get_info = {
                username: response.data[i].username,
              };

              axios
                .post(
                  "https://pet-care-service.herokuapp.com/pet-owners/get-caretaker-pets-information",
                  {
                    toGet: get_info,
                  }
                )
                .then((response) => {
                  let pet_length = response.data.length;
                  let pets_can = [];
                  for (let j = 0; j < pet_length; j++) {
                    pets_can.push(response.data[j].type_name);
                    let price = "$" + response.data[j].current_daily_price;
                    pets_can.push(price);
                  }
                  this.caretaker_take_care_animals_odd.push(pets_can);
                  this.animals_length_odd += 1;
                });
            } else {
              this.length_even += 1;
              this.caretaker_username_even.push(response.data[i].username);
              this.caretaker_name_even.push(response.data[i].name);
              let age = null;
              if (response.data[0].age.months != undefined && age == null) {
                age = response.data[0].age.months + " months ";
              } else if (
                response.data[0].age.months != undefined &&
                age != null
              ) {
                age += response.data[0].age.months + " months ";
              }

              if (response.data[0].age.days != undefined && age == null) {
                age = response.data[0].age.days + " days";
              } else if (
                response.data[0].age.days != undefined &&
                age != null
              ) {
                age += response.data[0].age.days + " days";
              }
              this.caretaker_age_even.push(age);
              this.caretaker_date_of_birth_even.push(
                response.data[i].birth_date.toString().split("T")[0]
              );
              this.caretaker_gender_even.push(response.data[i].gender);
              this.caretaker_phone_even.push(response.data[i].phone);
              this.caretaker_email_even.push(response.data[i].email);
              this.caretaker_address_even.push(response.data[i].address);
              this.caretaker_avg_rating_even.push(
                response.data[i].average_rating
              );
              let years = null;
              if (response.data[0].years_exp.years != undefined) {
                years = response.data[0].years_exp.years + " years ";
              }

              if (
                response.data[0].years_exp.months != undefined &&
                years == null
              ) {
                years = response.data[0].years_exp.months + " months ";
              } else if (
                response.data[0].years_exp.months != undefined &&
                years != null
              ) {
                years += response.data[0].years_exp.months + " months ";
              }

              if (
                response.data[0].years_exp.days != undefined &&
                years == null
              ) {
                years = response.data[0].years_exp.days + " days";
              } else if (
                response.data[0].years_exp.days != undefined &&
                years != null
              ) {
                years += response.data[0].years_exp.days + " days";
              }
              this.caretaker_years_exp_even.push(years);
              const get_pet_info = {
                username: response.data[i].username,
              };
              axios
                .post(
                  "https://pet-care-service.herokuapp.com/pet-owners/get-caretaker-pets-information",
                  {
                    toGet: get_pet_info,
                  }
                )
                .then((response) => {
                  let pet_length = response.data.length;
                  let pets_can = [];
                  for (let j = 0; j < pet_length; j++) {
                    pets_can.push(response.data[j].type_name);
                    let price = "$" + response.data[j].current_daily_price;
                    pets_can.push(price);
                  }
                  this.caretaker_take_care_animals_even.push(pets_can);
                  this.animals_length_even += 1;
                });
            }
          }
        }
      });
    console.log(this.length_odd);
    console.log(this.length_even);
    console.log(this.caretaker_username_even);
    this.loaded = true;
  },
};
</script>
