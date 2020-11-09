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
//import Swal from "sweetalert2";

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
  computed: {},
  methods: {},
  async mounted() {},
};
</script>
