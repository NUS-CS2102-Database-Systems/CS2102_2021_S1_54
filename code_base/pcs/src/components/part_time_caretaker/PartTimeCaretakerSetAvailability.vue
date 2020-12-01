<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PartTimeCaretakerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <v-list v-for="(dateField, i) in dateFields" :key="i">
          <v-row>
            {{ i + 1 }}.
            <v-col class="mx-auto">
              <template v-if="value1_editable[i]">
                <v-text-field
                  :label="dateField.label1"
                  v-model="dateField.value1"
                  value="dateField.value1"
                />
              </template>
              <template v-else>
                <v-text-field
                  :label="dateField.label1"
                  v-model="dateField.value1"
                  value="dateField.value1"
                  readonly
                />
              </template>
            </v-col>
            <v-col class="mx-auto">
              <template v-if="value2_editable[i]">
                <v-text-field
                  :label="dateField.label2"
                  v-model="dateField.value2"
                  value="dateField.value2"
                />
              </template>
              <template v-else>
                <v-text-field
                  :label="dateField.label2"
                  v-model="dateField.value2"
                  value="dateField.value2"
                  readonly
                />
              </template>
            </v-col>
            <template v-if="value1_editable[i] && value2_editable[i]">
              <v-btn icon color="red" fab @click="removeDates(i)">
                <v-icon>mdi-delete</v-icon>
                Delete
              </v-btn>
            </template>
          </v-row>
        </v-list>
        <v-row>
          <v-col class="mx-auto">
            <v-btn icon color="blue" fab @click="addDates">
              <v-icon>mdi-plus</v-icon>
              Add
            </v-btn>
          </v-col>
          <v-col class="mx-auto">
            <v-btn icon color="red" fab @click="cancel">
              <v-icon>mdi-close</v-icon>
              Cancel
            </v-btn>
          </v-col>
          <v-col class="mx-auto">
            <v-btn icon color="blue" fab @click="submit">
              <v-icon>mdi-content-save</v-icon>
              Submit
            </v-btn>
          </v-col>
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
import PartTimeCaretakerNavBar from "./PartTimeCaretakerNavBar";
import Swal from "sweetalert2";
import axios from "axios";

export default {
  name: "PartTimeCaretakerSetAvailability",

  components: {
    PartTimeCaretakerNavBar,
  },
  data: () => ({
    loaded: false,
    have_data: false,
    username: null,
    dateFields: [],
    datesToSubmit: [],
    number_of_pets_allowed_arr: [],
    num_of_pets: null,
    value1_editable: [],
    value2_editable: [],
    count: 0,
  }),
  methods: {
    addDates: function() {
      this.dateFields.push({
        label1: "Enter Start Date (YYYY-MM-DD)",
        value1: "",
        label2: "Enter End Date (YYYY-MM-DD)",
        value2: "",
      });
      this.value1_editable.push(true);
      this.value2_editable.push(true);
      this.number_of_pets_allowed_arr.push(this.num_of_pets);
    },
    removeDates: function(index) {
      this.dateFields.splice(index, 1);
    },
    cancel: function() {
      window.location.reload();
    },
    submit: async function() {
      console.log("Submitted");
      let data_ok_val1 = false;
      let data_ok_val2 = false;
      if (this.dateFields.length == 0) {
        this.count = 0;
        this.dateFields = [];
        data_ok_val1 = true;
        data_ok_val2 = true;
      } else {
        this.count = 0;
        for (let i = 0; i < this.dateFields.length; i++) {
          if (this.dateFields[i].value1.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
            var date1 = new Date(this.dateFields[i].value1);
            if (date1 instanceof Date && !isNaN(date1.valueOf())) {
              let year = this.dateFields[i].value1.slice(0, 4);
              let curr_date = new Date();
              let aYearFromNow = new Date();
              aYearFromNow.setFullYear(curr_date.getFullYear() + 1);
              let year_from_now = aYearFromNow.getFullYear();
              console.log(year_from_now);
              if (parseInt(year) > year_from_now) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text:
                    "Please provide availabilities for this year and next year only (at row " +
                    (i + 1) +
                    ")",
                });
                data_ok_val1 = false;
                break;
              } else {
                data_ok_val1 = true;
              }
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text:
                  "Please provide a valid start date(at row " + (i + 1) + ")",
              });
              data_ok_val1 = false;
              break;
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text:
                "Please provide a start date matching YYYY-MM-DD (at row " +
                (i + 1) +
                ")",
            });
            data_ok_val1 = false;
            break;
          }

          if (this.dateFields[i].value2.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
            var date2 = new Date(this.dateFields[i].value2);
            if (date2 instanceof Date && !isNaN(date2.valueOf())) {
              let year = this.dateFields[i].value2.slice(0, 4);
              let curr_date = new Date();
              let aYearFromNow = new Date();
              aYearFromNow.setFullYear(curr_date.getFullYear() + 1);
              let year_from_now = aYearFromNow.getFullYear();
              console.log(year_from_now);
              if (parseInt(year) > year_from_now) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text:
                    "Please provide availabilities for this year and next year only (at row " +
                    (i + 1) +
                    ")",
                });
                data_ok_val2 = false;
                break;
              } else {
                data_ok_val2 = true;
              }
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please provide a valid end date(at row " + (i + 1) + ")",
              });
              data_ok_val2 = false;
              break;
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text:
                "Please provide a end date matching YYYY-MM-DD (at row " +
                (i + 1) +
                ")",
            });
            data_ok_val2 = false;
            break;
          }

          if (date1 > date2) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Start date greater than end date (at row " + (i + 1) + ")",
            });
            data_ok_val1 = false;
            data_ok_val2 = false;
            break;
          }
          if (data_ok_val1 == true && data_ok_val2 == true) {
            this.count += 1;
            var setAvailability = {};
            if (this.have_data == false) {
              if (this.number_of_pets_allowed == undefined) {
                this.number_of_pets_allowed = 2;
              }

              setAvailability = {
                caretaker_username: this.username,
                start_date: this.dateFields[i].value1,
                end_date: this.dateFields[i].value2,
                num_pets: this.number_of_pets_allowed,
              };
            } else {
              setAvailability = {
                caretaker_username: this.username,
                start_date: this.dateFields[i].value1,
                end_date: this.dateFields[i].value2,
                num_pets: this.number_of_pets_allowed_arr[i],
              };
            }
            this.datesToSubmit.push(setAvailability);
          }
        }
      }

      if (data_ok_val1 == true && data_ok_val2 == true) {
        console.log(this.datesToSubmit);
        // no previous data, so insert
        if (this.have_data == false) {
          await axios
            .post(
              "https://pet-care-service.herokuapp.com/part-time-caretakers/add-availabilities-information",
              {
                toEdit: this.datesToSubmit,
              }
            )
            .then((response) => {
              console.log(response.data);
              if (response.data[0].num == this.count) {
                Swal.fire({
                  icon: "success",
                  title: "Submit Successful!",
                }).then(function() {
                  location.reload();
                });
              } else {
                console.log(response.data[0]);
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Adding availabilities failed. Please try again.",
                });
              }
            });
        } else {
          await axios
            .post(
              "https://pet-care-service.herokuapp.com/part-time-caretakers/edit-availabilities-information",
              {
                toEdit: this.datesToSubmit,
              }
            )
            .then((response) => {
              console.log(response.data);
              if (response.data[0].count == this.count) {
                Swal.fire({
                  icon: "success",
                  title: "Update Successful!",
                }).then(function() {
                  location.reload();
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text:
                    "Updating availabilities failed. " +
                    response.data +
                    ". Please try again.",
                });
              }
            });
        }
        this.datesToSubmit = [];
      }
    },
  },
  async mounted() {
    this.username = document.cookie.split("=")[1];
    let today_date = new Date();

    const get_info = {
      username: this.username,
    };

    // need to sort by start date asc and end date asc
    await axios
      .post(
        "https://pet-care-service.herokuapp.com/part-time-caretakers/get-availabilities-information",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        console.log(response.data);
        let length = response.data.length;
        this.dateFields = [];
        if (length == 0) {
          this.have_data = false;
          this.value1_editable.push(true);
          this.value2_editable.push(true);
          // axios to get num of pets allowed from availabilties
          // latest available date
          // If dont have any data at all, then set to 2
          axios
            .post(
              "https://pet-care-service.herokuapp.com/part-time-caretakers/get-num-of-pets-information",
              {
                toGet: get_info,
              }
            )
            .then((response) => {
              this.count = response.data.length;
              console.log(response.data);
              if (response.data.number_of_pets_allowed != 0) {
                this.num_of_pets = response.data.number_of_pets_allowed;
              } else {
                this.num_of_pets = 2;
              }
            });
        } else {
          this.have_data = true;
          for (let i = 0; i < length; i++) {
            let start_date = response.data[i].start_date.split("T")[0];
            let end_date = response.data[i].end_date.split("T")[0];
            let arr = {
              value1: start_date,
              value2: end_date,
            };
            this.dateFields.push(arr);
            this.number_of_pets_allowed_arr.push(
              response.data[i].number_of_pets_allowed
            );
            this.num_of_pets = response.data[i].number_of_pets_allowed;
            if (new Date(response.data[i].start_date) <= today_date) {
              this.value1_editable.push(false);
            } else if (new Date(response.data[i].start_date) > today_date) {
              this.value1_editable.push(true);
            }

            if (new Date(response.data[i].end_date) <= today_date) {
              this.value2_editable.push(false);
            } else if (new Date(response.data[i].end_date) > today_date) {
              this.value2_editable.push(true);
            }
          }
        }
      });
    this.loaded = true;
  },
};
</script>
