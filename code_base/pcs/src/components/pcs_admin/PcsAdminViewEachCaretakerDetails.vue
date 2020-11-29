<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PcsAdminNavBar />
    </div>
    <div style="width: 80%; float: right">
      <h2 style="text-align:center">
        Number of pet-days and number of pets taken care of by each Caretaker in
        {{ month }} {{ year }}
      </h2>
      <br />
      <template v-if="loaded && bid_transaction.length > 0">
        <v-data-table
          multi-sort
          :headers="headers"
          :items="bid_transaction"
          :items-per-page="10"
          class="elevation-1"
          @click:row="handleClick"
        >
        </v-data-table>
      </template>
      <template v-else-if="loaded && bid_transaction == 0">
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
              No information regarding the salary, number of pet-days and number
              of pets taken care of by each caretaker for this month can be
              found at the moment.
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
import PcsAdminNavBar from "./PcsAdminNavBar";
import axios from "axios";

export default {
  name: "PcsAdminViewEachCaretakerDetails",
  components: {
    PcsAdminNavBar,
  },
  data: () => ({
    loaded: true,
    month: null,
    year: null,
    bid_transaction: [],
    headers: [
      {
        text: "No.",
        value: "number",
        align: "left",
      },
      {
        text: "Caretaker",
        value: "cusername",
        align: "center",
      },
      {
        text: "Total Number Of Pets taken care of",
        value: "totalNumPets",
        align: "center",
      },
      {
        text: "Total Number Of Pet-Days",
        value: "totalNumDays",
        align: "center",
      },
      // {
      //   text: "Salary",
      //   value: "salary",
      //   align: "center",
      // },
    ],
  }),
  methods: {
    handleClick: function(value) {
      console.log(value.number);
      console.log(this.bid_transaction[value.number - 1].cusername);
      // console.log(this.bid_transaction[index]);
    },
  },
  async mounted() {
    this.loaded = false;
    let date = new Date();
    this.month = date.toLocaleString("default", { month: "long" });
    this.year = date.getFullYear();

    await axios
      .get(
        "https://pet-care-service.herokuapp.com/pcs-admin/get-num-pets-and-pet-days-by-each-caretaker"
      )
      .then((response) => {
        console.log(response.data);
        for (let i = 0; i < response.data.length; i++) {
          let caretaker_data = {
            number: i + 1,
            cusername: response.data[i].cusername,
            totalNumPets: response.data[i].num_pets,
            totalNumDays: response.data[i].num_pet_days,
            // salary: response.data[i].salary,
          };
          this.bid_transaction.push(caretaker_data);
        }
      });
    this.loaded = true;
  },
};
</script>
