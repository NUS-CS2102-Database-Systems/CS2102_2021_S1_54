<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PcsAdminNavBar />
    </div>
    <div style="width: 80%; float: right">
      <v-data-table
        multi-sort
        :headers="headers"
        :items="bid_transaction"
        :items-per-page="20"
        class="elevation-1"
      >
      </v-data-table>
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
    bid_transaction: [],
    headers: [
      {
        text: "Caretaker",
        value: "cusername",
      },
      {
        text: "Total Number Of Pets taken care of",
        value: "totalNumPets",
      },
    ],
  }),
  async mounted() {
    await axios
      .get(
        "https://pet-care-service.herokuapp.com/pcs-admin/get-num-pets-and-pet-days-by-each-caretaker"
      )
      .then((response) => {
        console.log(response.data);
      });
  },
};
</script>
