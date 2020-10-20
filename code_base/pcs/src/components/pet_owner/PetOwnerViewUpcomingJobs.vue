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
                label="Choose Range of Dates"
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
              range
            />
          </v-menu>
        </v-col>
        <v-col class="mx-auto" md="3">
          <v-select
            v-model="selected_pet_names"
            :items="pet_names"
            item-text="name"
            item-value="value"
            label="Pet Name(s)"
            prepend-icon="mdi-github"
            filled
            clearable
            multiple
            dense
            color="#000000"
            @input="selectPetNames"
            @click:clear="clearPetNames"
          />
        </v-col>
        <v-col class="mx-auto" md="1">
          <v-btn icon color="blue" fab outlined @click="submit">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <template v-if="loaded && have_data">
        <v-col class="mx-auto">
          <v-list v-for="(number, i) in id_odd" :key="number">
            <v-row>
              <v-card width="45%">
                <v-card-title> Job {{ number }} </v-card-title>
                <p>
                  Caretaker Username: {{ caretaker_odd[i] }} <br />
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
                  Caretaker Username: {{ caretaker_even[i] }} <br />
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
      <template v-else-if="loaded && !have_data">
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

export default {
  name: "PetOwnerViewUpcomingJobs",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: true,
    have_data: true,
    username: null,
    commitment_levels: [
      { name: "Full-time", value: "full-time" },
      { name: "Part-time", value: "part-time" },
    ],
    pet_names: [],
    available_dates: false,
    selected_commitment_level: null,
    selected_dates: null,
    selected_pet_names: null,
    id_odd: [],
    id_even: [],
    caretaker_odd: [],
    caretaker_even: [],
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
  }),
  computed: {
    dateDisplay() {
      return this.selected_dates;
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
      this.selected_dates = this.selected_dates.sort();
      console.log(this.selected_dates);
    },
    clearDates: function() {
      this.selected_dates = null;
    },
    selectPetNames: function() {
      console.log(this.selected_pet_names);
    },
    clearPetNames: function() {
      this.selected_pet_names = null;
    },
    submit: function() {
      console.log("Submitted");
      let data_ok = true;

      if (this.selected_commitment_level != null) {
        var commitment_level = '"' + this.selected_commitment_level + '"';
      } else {
        commitment_level = null;
      }

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

      if (this.selected_pet_names != null) {
        if (this.selected_pet_names.length > 0) {
          this.selected_pet_names = this.selected_pet_names.sort();
          console.log("pet names: " + this.selected_pet_names);
          var animal_names = '"';
          for (let m = 0; m < this.selected_pet_names.length; m++) {
            animal_names += this.selected_pet_names[m] + ",";
          }

          if (animal_names.includes(",")) {
            animal_names = animal_names.slice(0, -1);
          }
          animal_names += '"';
        } else {
          animal_names = null;
        }
      } else {
        animal_names = null;
      }

      if (data_ok == true) {
        const dataToSend =
          '{"commitment":' +
          commitment_level +
          ',"dates":' +
          dates +
          ', "animal_names":' +
          animal_names +
          "}";

        console.log(dataToSend);
        let jsonDataToSend = JSON.parse(dataToSend);
        console.log(jsonDataToSend);
      }
    },
    fetchData: async function() {
      // set caretaker username and pet names as links
      // set pet names as options for select
      // const response = axios.get(api)
      // console.log(response.fullTime.data)
      // console.log(response.partTime.data)
      // if (response.data.fullTime.data.length == 0 && response.partTime.data.length == 0) {
      //   this.have_data = false;
      // } else {
      // }
    },
  },
  async mounted() {
    if (document.cookie.includes(";")) {
      let split_cookie = document.cookie.split(";");
      console.log("split profile:" + split_cookie[0]);
      var get_last_cookie = split_cookie[0];
    } else {
      get_last_cookie = document.cookie;
    }
    let get_last_cookie_split = get_last_cookie.split("=");
    this.username = get_last_cookie_split[1];
  },
};
</script>
