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
      <template v-if="loaded">
        <v-data-table
          multi-sort
          :headers="headers"
          :items="bid_transaction"
          :items-per-page="10"
          class="elevation-1"
        >
        </v-data-table>
      </template>
      <template v-else>
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
  name: "PcsAdminViewNumOfPetsCaredByEachCaretaker",
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
    ],
  }),
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
          };
          this.bid_transaction.push(caretaker_data);
        }
      });
    this.loaded = true;
  },
};
</script>
