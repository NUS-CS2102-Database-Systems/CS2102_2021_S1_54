<template>
  <v-container>
    <div style="width: 20%; float: left">
      <CaretakerNavBar />
    </div>
    <div style="width: 80%; float: right"></div>
    <v-row>
      <v-col class="mx-auto" md="3">
        <v-menu
          v-model="dates_to_look_at"
          :nudge-right="40"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              label="Choose Date(s)"
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
            v-model="selected_dates"
            @click:date="selectDates"
            :max="get_current_date"
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
        <v-list v-for="(number, i) in id_odd" :key="number">
          <v-row>
            <v-card width="45%">
              <v-card-title> Job {{ number }} </v-card-title>
              <p>
                Pet Owner Username: {{ pet_owner_odd[i] }} <br />
                Pet Name: {{ pet_odd[i] }} <br />
                Job Started: {{ job_start_odd[i] }} <br />
                Job Ended: {{ job_end_odd[i] }} <br />
                Transfer Method (Pick Up): {{ start_transfer_method_odd[i] }}
                <br />
                Transfer Method (Drop Off): {{ end_transfer_method_odd[i] }}
                <br />
                Amount: {{ amount_odd[i] }} <br />
                Rating: {{ rating_odd[i] }} <br />
                Review: {{ review_even[i] }} <br />
              </p>
            </v-card>
          </v-row>
        </v-list>
      </v-col>
      <v-spacer />
      <v-col class="mx-auto">
        <v-list v-for="(number, i) in id_even" :key="number">
          <v-row>
            <v-card width="45%">
              <v-card-title> Job {{ number }} </v-card-title>
              <p>
                Pet Owner Username: {{ pet_owner_even[i] }} <br />
                Pet Name: {{ pet_even[i] }} <br />
                Job Started: {{ job_start_even[i] }} <br />
                Job Ended: {{ job_end_even[i] }} <br />
                Transfer Method (Pick Up): {{ start_transfer_method_even[i] }}
                <br />
                Transfer Method (Drop Off): {{ end_transfer_method_even[i] }}
                <br />
                Amount: {{ amount_even[i] }} <br />
                Rating: {{ rating_even[i] }} <br />
                Review: {{ review_even[i] }} <br />
              </p>
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
  </v-container>
</template>

<script>
import CaretakerNavBar from "./CaretakerNavBar";
// import LogIn from "../LogIn";
import Swal from "sweetalert2";
// import axios from "axios";
// import * as constants from "../constants";

export default {
  name: "CaretakerViewPastJobs",
  // get caretaker username from login page as props!
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  components: {
    CaretakerNavBar,
  },
  data: () => ({
    have_data: true,
    loaded: true,
    id_odd: [],
    id_even: [],
    pet_owner_odd: [],
    pet_owner_even: [],
    pet_odd: [],
    pet_even: [],
    job_start_odd: [],
    job_start_even: [],
    job_end_odd: [],
    job_end_even: [],
    amount_odd: [],
    amount_even: [],
    start_transfer_method_odd: [],
    start_transfer_method_even: [],
    end_transfer_method_odd: [],
    end_transfer_method_even: [],
    rating_odd: [],
    rating_even: [],
    review_odd: [],
    review_even: [],
    dates_to_look_at: false,
    selected_dates: null,
    get_current_date: new Date().toISOString().substr(0, 10),
    rating_types: [
      { name: "0 to 1", value: "0" },
      { name: "1 to 2", value: "1" },
      { name: "2 to 3", value: "2" },
      { name: "3 to 4", value: "3" },
      { name: "4 to 5", value: "4" },
    ],
    pet_types: [
      { name: "Cats", value: "cat" },
      { name: "Small Dogs", value: "small dog" },
      { name: "Big Dogs", value: "big dog" },
      { name: "Birds", value: "bird" },
    ],
    selected_rating: null,
    selected_pet_type: null,
  }),
  computed: {
    dateDisplay() {
      return this.selected_dates;
    },
  },
  methods: {
    selectDates: function() {
      this.selected_dates = this.selected_dates.sort();
      console.log(this.selected_dates);
    },
    clearDates: function() {
      this.selected_dates = null;
    },
    selectRating: function() {
      console.log(this.selected_rating);
    },
    clearRating: function() {
      this.selected_rating = null;
    },
    selectPetType: function() {
      console.log(this.selected_pet_type);
    },
    clearPetType: function() {
      this.selected_pet_type = null;
    },
    submit: function() {
      console.log("Submit");
      let data_ok = true;

      if (this.selected_dates != null) {
        if (this.selected_dates.length == 1) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please provide a range of dates",
          });
          this.selected_dates = null;
          data_ok = false;
        } else {
          var dates =
            '"' + this.selected_dates[0] + "," + this.selected_dates[1] + '"';
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

      if (data_ok == true) {
        const dataToSend =
          '{"dates":' +
          dates +
          ', "rating":' +
          rating_wanted +
          ', "animal_type":' +
          animal_type +
          "}";

        console.log(dataToSend);
        let jsonDataToSend = JSON.parse(dataToSend);
        console.log(jsonDataToSend);
      }
    },
    fetchData: async function() {
      // Pet Owner username and Pet Name to be converted to links!
      // let api = "/pet-care/caretakers/view-past-jobs/username=" + this.username;
      // const response = await axios.get(api);
      // console.log(response.data);
      // if (response.data.length == 0) {
      //   this.have_data = false;
      // } else {
      //   for (let i = 0; i < response.data.length; i++) {
      //     let cust_review = response.data[i].review;
      //     let cust_rating = response.data[i].rating;
      //     if (cust_review == null) {
      //       cust_review = "-";
      //     }
      //     if (cust_rating == null) {
      //       cust_rating = "-";
      //     }
      //     let pet_owner_username_received_as_link =
      //       '"' + constants.caretaker_view_pet_owner_domain;
      //     pet_owner_username_received_as_link = pet_owner_username_received_as_link.replace(
      //       /value1/,
      //       response.data[i].pusername
      //     );
      //     pet_owner_username_received_as_link += '"';
      //     let pet_owner_username_received = response.data[i].pusername;
      //     let pet_name_received_as_link =
      //       '"' + constants.caretaker_view_pet_domain;
      //     pet_name_received_as_link = pet_name_received_as_link.replace(
      //       /value1/,
      //       response.data[i].pusername
      //     );
      //     pet_name_received_as_link = pet_name_received_as_link.replace(
      //       /value2/,
      //       response.data[i].pet_name
      //     );
      //     pet_name_received_as_link += '"';
      //     let pet_name_received = response.data[i].pet_name;
      //     if (i % 2 == 0) {
      //       let j = i + 1;
      //       this.id_odd.push(j);
      //       this.pet_owner_odd.push(
      //         pet_owner_username_received.link(
      //           pet_owner_username_received_as_link
      //         )
      //       );
      //       this.pet_odd.push(
      //         pet_name_received.link(pet_name_received_as_link)
      //       );
      //       this.job_start_odd.push(response.data[i].job_start_datetime);
      //       this.job_end_odd.push(response.data[i].job_end_datetime);
      //       this.amount_odd.push(response.data[i].amount);
      //       this.start_transfer_method_odd.push(
      //         response.data[i].start_transfer_method
      //       );
      //       this.end_transfer_method_odd.push(
      //         response.data[i].end_transfer_method
      //       );
      //       this.review_odd.push(cust_review);
      //       this.rating_odd.push(cust_rating);
      //     } else {
      //       let k = i + 1;
      //       this.id_even.push(k);
      //       this.pet_owner_even.push(
      //         pet_owner_username_received.link(
      //           pet_owner_username_received_as_link
      //         )
      //       );
      //       this.pet_even.push(
      //         pet_name_received.link(pet_name_received_as_link)
      //       );
      //       this.job_start_even.push(response.data[i].job_start_datetime);
      //       this.job_end_even.push(response.data[i].job_end_datetime);
      //       this.amount_even.push(response.data[i].amount);
      //       this.start_transfer_method_even.push(
      //         response.data[i].start_transfer_method
      //       );
      //       this.end_transfer_method_even.push(
      //         response.data[i].end_transfer_method
      //       );
      //       this.review_even.push(cust_review);
      //       this.rating_even.push(cust_rating);
      //     }
      //   }
      //   this.have_data = true;
      // }
    },
  },
  async mounted() {
    // for v-card to display 2 at a time, create 2 arrays of data: even and odd.
    // if in the response the data is in odd index go to odd array and similarly for even
    // then display in v-cards for even and odd using spacer
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
