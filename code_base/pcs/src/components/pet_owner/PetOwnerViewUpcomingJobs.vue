<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <v-row>
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
              :min="getTomorrowDate"
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
                <v-card-text>
                  Caretaker Username: {{ caretaker_odd[i] }} <br />
                  Pet Name: {{ pet_odd[i] }} <br />
                  Job Started: {{ job_start_odd[i] }} <br />
                  Job Ended: {{ job_end_odd[i] }} <br />
                  Transfer Method (Pick Up): {{ start_transfer_method_odd[i] }}
                  <br />
                  Transfer Method (Drop Off): {{ end_transfer_method_odd[i] }}
                  <br />
                  Amount: {{ amount_odd[i] }} <br />
                </v-card-text>
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
                <v-card-text>
                  Caretaker Username: {{ caretaker_even[i] }} <br />
                  Pet Name: {{ pet_even[i] }} <br />
                  Job Started: {{ job_start_even[i] }} <br />
                  Job Ended: {{ job_end_even[i] }} <br />
                  Transfer Method (Pick Up): {{ start_transfer_method_even[i] }}
                  <br />
                  Transfer Method (Drop Off): {{ end_transfer_method_even[i] }}
                  <br />
                  Amount: {{ amount_even[i] }} <br />
                </v-card-text>
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
import axios from "axios";

export default {
  name: "PetOwnerViewUpcomingJobs",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: false,
    have_data: false,
    username: null,
    pet_names: [],
    available_dates: false,
    selected_dates: null,
    selected_pet_names: null,
    getTomorrowDate: new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .substr(0, 10),
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
    payment_method_even: [],
    payment_method_odd: [],
    payment_datetime_even: [],
    payment_datetime_odd: [],
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
    selectPetNames: function() {
      console.log(this.selected_pet_names);
    },
    clearPetNames: function() {
      this.selected_pet_names = null;
    },
    submit: async function() {
      console.log("Submitted");
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
            '"' +
            this.selected_dates[0] +
            "T00:00:00.000Z" +
            "," +
            this.selected_dates[1] +
            "T23:59:59.999Z" +
            '"';
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
          '{"username":"' +
          this.username +
          '", "dates":' +
          dates +
          ', "animal_names":' +
          animal_names +
          "}";

        console.log(dataToSend);
        let jsonDataToSend = JSON.parse(dataToSend);
        console.log(jsonDataToSend);
        await axios
          .post(
            "https://pet-care-service.herokuapp.com/pet-owners/get-specific-upcoming-jobs-information",
            {
              toGet: jsonDataToSend,
            }
          )
          .then((response) => {
            this.id_odd = [];
            this.caretaker_odd = [];
            this.pet_odd = [];
            this.job_start_odd = [];
            this.job_end_odd = [];
            this.start_transfer_method_odd = [];
            this.end_transfer_method_odd = [];
            this.amount_odd = [];
            this.id_even = [];
            this.caretaker_even = [];
            this.pet_even = [];
            this.job_start_even = [];
            this.job_end_even = [];
            this.start_transfer_method_even = [];
            this.end_transfer_method_even = [];
            this.amount_even = [];
            this.payment_method_even = [];
            this.payment_method_odd = [];
            this.payment_datetime_even = [];
            this.payment_datetime_odd = [];
            this.loaded = false;
            let length = response.data.length;
            if (length == 0) {
              this.have_data = false;
              this.loaded = true;
            } else {
              this.have_data = true;
              for (let i = 0; i < length; i++) {
                if (i % 2 == 0) {
                  this.id_odd.push(i + 1);
                  this.caretaker_odd.push(response.data[i].cusername);
                  this.pet_odd.push(response.data[i].pet_name);
                  let job_start =
                    response.data[i].job_start_datetime.split("T")[0] +
                    " " +
                    response.data[i].job_start_datetime.split("T")[1];
                  this.job_start_odd.push(job_start);
                  let job_end =
                    response.data[i].job_end_datetime.split("T")[0] +
                    " " +
                    response.data[i].job_end_datetime.split("T")[1];
                  this.job_end_odd.push(job_end);
                  this.start_transfer_method_odd.push(
                    response.data[i].start_transfer_method
                  );
                  this.end_transfer_method_odd.push(
                    response.data[i].end_transfer_method
                  );
                  this.amount_odd.push(response.data[i].amount);
                  this.payment_method_odd.push(response.data[i].payment_method);
                  this.payment_datetime_odd.push(
                    response.data[i].payment_datetime
                  );
                } else {
                  this.id_even.push(i + 1);
                  this.caretaker_even.push(response.data[i].cusername);
                  this.pet_even.push(response.data[i].pet_name);
                  let job_start =
                    response.data[i].job_start_datetime.split("T")[0] +
                    " " +
                    response.data[i].job_start_datetime.split("T")[1];
                  this.job_start_even.push(job_start);
                  let job_end =
                    response.data[i].job_end_datetime.split("T")[0] +
                    " " +
                    response.data[i].job_end_datetime.split("T")[1];
                  this.job_end_even.push(job_end);
                  this.start_transfer_method_even.push(
                    response.data[i].start_transfer_method
                  );
                  this.end_transfer_method_even.push(
                    response.data[i].end_transfer_method
                  );
                  this.amount_even.push(response.data[i].amount);
                  this.payment_method_even.push(
                    response.data[i].payment_method
                  );
                  this.payment_datetime_even.push(
                    response.data[i].payment_datetime
                  );
                }
              }
              this.loaded = true;
            }
          });
      }
    },
  },
  async mounted() {
    this.username = document.cookie.split("=")[1];
    const get_info = {
      username: this.username,
    };

    await axios
      .post("https://pet-care-service.herokuapp.com/pet-owners/get-pet-names", {
        toGet: get_info,
      })
      .then((response) => {
        let length = response.data.length;
        for (var i = 0; i < length; i++) {
          let arr = {
            name: response.data[i].pet_name,
            value: response.data[i].pet_name,
          };
          this.pet_names.push(arr);
        }
      });

    await axios
      .post(
        "https://pet-care-service.herokuapp.com/pet-owners/get-upcoming-jobs-information",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        let length = response.data.length;
        console.log(length);
        console.log(response.data);
        if (length == 0) {
          this.have_data = false;
        } else {
          this.have_data = true;
          for (let i = 0; i < length; i++) {
            if (i % 2 == 0) {
              this.id_odd.push(i + 1);
              this.caretaker_odd.push(response.data[i].cusername);
              this.pet_odd.push(response.data[i].pet_name);
              let job_start =
                response.data[i].job_start_datetime.split("T")[0] +
                " " +
                response.data[i].job_start_datetime.split("T")[1];
              this.job_start_odd.push(job_start);
              let job_end =
                response.data[i].job_end_datetime.split("T")[0] +
                " " +
                response.data[i].job_end_datetime.split("T")[1];
              this.job_end_odd.push(job_end);
              this.start_transfer_method_odd.push(
                response.data[i].start_transfer_method
              );
              this.end_transfer_method_odd.push(
                response.data[i].end_transfer_method
              );
              this.amount_odd.push(response.data[i].amount);
              this.payment_method_odd.push(response.data[i].payment_method);
              this.payment_datetime_odd.push(response.data[i].payment_datetime);
            } else {
              this.id_even.push(i + 1);
              this.caretaker_even.push(response.data[i].cusername);
              this.pet_even.push(response.data[i].pet_name);
              let job_start =
                response.data[i].job_start_datetime.split("T")[0] +
                " " +
                response.data[i].job_start_datetime.split("T")[1];
              this.job_start_even.push(job_start);
              let job_end =
                response.data[i].job_end_datetime.split("T")[0] +
                " " +
                response.data[i].job_end_datetime.split("T")[1];
              this.job_end_even.push(job_end);
              this.start_transfer_method_even.push(
                response.data[i].start_transfer_method
              );
              this.end_transfer_method_even.push(
                response.data[i].end_transfer_method
              );
              this.amount_even.push(response.data[i].amount);
              this.payment_method_even.push(response.data[i].payment_method);
              this.payment_datetime_even.push(
                response.data[i].payment_datetime
              );
            }
          }
        }
      });
    this.loaded = true;
  },
};
</script>
