<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
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
        <v-col class="mx-auto">
          <v-list v-for="i in caretaker_username_odd" :key="i">
            <v-row>
              <v-card width="45%">
                <v-card-title> {{ caretaker_username_odd[i] }} </v-card-title>
                <v-card-text>
                  Date of Birth: {{ caretaker_date_of_birth_odd[i] }} <br />
                  Age: {{ caretaker_age_odd[i] }} <br />
                  Gender: {{ caretaker_gender_odd[i] }} <br />
                  Years of Experience: {{ caretaker_years_exp_odd[i] }} <br />
                  Phone: {{ caretaker_phone_odd[i] }} <br />
                  Email: {{ caretaker_email_odd[i] }}
                  <br />
                  Address: {{ caretaker_address_odd[i] }}
                  <br />
                  Average Rating: {{ caretaker_avg_rating_odd[i] }} <br />
                  Can Take Care of: {{ caretaker_take_care_animals_odd[i] }}
                </v-card-text>
              </v-card>
            </v-row>
          </v-list>
        </v-col>
        <v-spacer />
        <v-col class="mx-auto">
          <v-list v-for="i in caretaker_username_even" :key="i">
            <v-row>
              <v-card width="45%">
                <v-card-title> {{ caretaker_username_even[i] }} </v-card-title>
                <v-card-text>
                  Date of Birth: {{ caretaker_date_of_birth_even[i] }} <br />
                  Age: {{ caretaker_age_even[i] }} <br />
                  Gender: {{ caretaker_gender_even[i] }} <br />
                  Years of Experience: {{ caretaker_years_exp_even[i] }} <br />
                  Phone: {{ caretaker_phone_even[i] }} <br />
                  Email: {{ caretaker_email_even[i] }}
                  <br />
                  Address: {{ caretaker_address_even[i] }}
                  <br />
                  Average Rating: {{ caretaker_avg_rating_even[i] }} <br />
                  Can Take Care of: {{ caretaker_take_care_animals_even[i] }}
                </v-card-text>
              </v-card>
            </v-row>
          </v-list>
        </v-col>
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
import Swal from "sweetalert2";
// import axios from "axios";
// import * as constants from "../constants";

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
      { name: "Cat", value: "cat" },
      { name: "Small Dog", value: "small dog" },
      { name: "Big Dog", value: "big dog" },
      { name: "Bird", value: "bird" },
      { name: "Rodent", value: "rodent" },
    ],
    available_dates: false,
    search: null,
    rating: null,
    price_from: null,
    price_to: null,
    have_data: true,
    loaded: true,
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
    submit: function() {
      let data_ok = true;

      if (this.selected_commitment_level) {
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

      if (this.selected_price_from) {
        var min_price = '"' + this.selected_price_from + '"';
      } else {
        min_price = null;
      }

      if (this.selected_price_to) {
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

      if (this.selected_rating) {
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
        // axios
        //   .post("/pet-care/pet-owners/caretakers", {
        //     caretaker: jsonDataToSend,
        //   })
        //   .then((response) => {
        //     this.caretaker_username = [];
        //     this.loaded = false;
        //     this.have_data = false;
        //     console.log(response.data);
        //     if (response.data.length > 0) {
        //       this.have_data = true;
        //       for (let i = 0; i < response.data.length; i++) {
        //         let data_received_as_link =
        //           '"' + constants.caretaker_view_pet_owner_domain;
        //         data_received_as_link = data_received_as_link.replace(
        //           /value1/,
        //           response.data[i].username
        //         );

        //         data_received_as_link += '"';

        //         let data_received = response.data[i].username;
        //         this.caretaker_username.push(
        //           data_received.link(data_received_as_link)
        //         );
        //       }
        //       this.loaded = true;
        //     } else {
        //       this.have_data = false;
        //       this.loaded = true;
        //     }
        //   });
      }
    },
    // fetchData: async function() {
    //   const response = await axios.get("/pet-care/pet-owners/caretakers");
    //   console.log(response.data);
    //   if (response.data.length == 0) {
    //     this.have_data = false;
    //   } else {
    //     for (let i = 0; i < response.data.length; i++) {
    //       let data_received_as_link =
    //         '"' + constants.caretaker_view_pet_owner_domain;
    //       data_received_as_link = data_received_as_link.replace(
    //         /value1/,
    //         response.data[i].username
    //       );

    //       data_received_as_link += '"';

    //       let data_received = response.data[i].username;
    //       this.caretaker_username.push(
    //         data_received.link(data_received_as_link)
    //       );
    //     }
    //     this.have_data = true;
    //   }
    // },
  },
  async mounted() {
    console.log("Doc Caretaker: " + document.cookie);
    this.username = document.cookie.split("=")[1];
    // this.loaded = false;
    // try {
    //   await this.fetchData();
    //   this.loaded = true;
    // } catch (e) {
    //   console.error(e);
    // }
  },
};
</script>
