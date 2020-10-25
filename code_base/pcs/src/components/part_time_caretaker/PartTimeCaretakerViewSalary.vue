<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PartTimeCaretakerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <v-row>
        <v-col class="mx-auto" md="4">
          <v-menu
            v-model="available_months"
            :nudge-right="40"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                label="Choose Month(s)"
                :value="dateDisplay"
                v-on="on"
                clearable
                prepend-icon="mdi-calendar"
                filled
                dense
                color="#000000"
                @click:clear="clearMonths"
              />
            </template>
            <v-date-picker
              v-model="selected_months"
              :max="getEndDate"
              type="month"
              scrollable
              reactive
              multiple
            />
          </v-menu>
        </v-col>
        <v-col class="mx-auto" md="1">
          <v-btn icon color="blue" fab outlined @click="submit">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <template v-if="loaded && have_data">
        <v-data-table :headers="headers" :items="salary"> </v-data-table>
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
              Hi {{ username }}. You do not have any past salary to view at the
              moment.
              <br />
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
import PartTimeCaretakerNavBar from "./PartTimeCaretakerNavBar";
// import Swal from "sweetalert2";

export default {
  name: "PartTimeCaretakerViewSalary",

  components: {
    PartTimeCaretakerNavBar,
  },
  data: () => ({
    loaded: true,
    have_data: true,
    username: null,
    available_months: false,
    selected_months: null,
    getEndDate: new Date().toISOString().substr(0, 10),
    salary: [],
    headers: [
      {
        text: "Month Year",
        value: "month_year",
      },
      {
        text: "Salary (SGD)",
        value: "salary",
      },
    ],
  }),
  computed: {
    dateDisplay() {
      return this.selected_months;
    },
  },
  methods: {
    clearMonths: function() {
      this.selected_months = null;
    },
    submit: function() {
      console.log("Submitted");
      console.log(this.selected_months);
      if (this.selected_months != null) {
        var months = '"' + this.selected_months.sort() + '"';
      } else {
        months = null;
      }
      const dataToSend = '{"months":' + months + "}";
      console.log(dataToSend);
      let jsonDataToSend = JSON.parse(dataToSend);
      console.log(jsonDataToSend);
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
