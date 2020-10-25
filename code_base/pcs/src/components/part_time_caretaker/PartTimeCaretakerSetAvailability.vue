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
              <v-text-field
                :label="dateField.label1"
                v-model="dateField.value1"
              />
            </v-col>
            <v-col class="mx-auto">
              <v-text-field
                :label="dateField.label2"
                v-model="dateField.value2"
              />
            </v-col>
            <v-btn icon color="red" fab @click="removeDates(i)">
              <v-icon>mdi-delete</v-icon>
              Delete
            </v-btn>
          </v-row>
        </v-list>
        <v-btn icon color="blue" fab @click="addDates">
          <v-icon>mdi-plus</v-icon>
          Add
        </v-btn>
        <br />
        <v-btn icon color="blue" fab @click="submit">
          <v-icon>mdi-content-save</v-icon>
          Submit
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
import PartTimeCaretakerNavBar from "./PartTimeCaretakerNavBar";
import Swal from "sweetalert2";

export default {
  name: "PartTimeCaretakerSetAvailability",

  components: {
    PartTimeCaretakerNavBar,
  },
  data: () => ({
    loaded: true,
    username: null,
    dateFields: [],
    datesToSubmit: [],
  }),
  methods: {
    addDates: function() {
      this.dateFields.push({
        label1: "Enter Start Date (YYYY-MM-DD)",
        value1: "",
        label2: "Enter End Date (YYYY-MM-DD)",
        value2: "",
      });
    },
    removeDates: function(index) {
      this.dateFields.splice(index, 1);
    },
    submit: function() {
      console.log("Submitted");
      let data_ok_val1 = false;
      let data_ok_val2 = false;
      if (this.dateFields.length == 0) {
        this.dateFields = [];
        data_ok_val1 = true;
        data_ok_val2 = true;
      } else {
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
            break;
          }

          if (date1 > date2) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "End date greater than start date (at row " + (i + 1) + ")",
            });
            data_ok_val1 = false;
            data_ok_val2 = false;
            break;
          }
          if (data_ok_val1 == true && data_ok_val2 == true) {
            const setAvailability = {
              start_date: this.dateFields[i].value1,
              end_date: this.dateFields[i].value2,
            };
            this.datesToSubmit.push(setAvailability);
          }
        }
      }

      if (data_ok_val1 == true && data_ok_val2 == true) {
        console.log(this.datesToSubmit);
        this.datesToSubmit = [];
        Swal.fire({
          icon: "success",
          title: "Submit Successful!",
        });
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
    this.username = document.cookie.split("=")[1];
  },
};
</script>
