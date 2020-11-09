<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PcsAdminNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h2>Welcome to Petopia, {{ username }}!</h2>
        <br />
        <v-card width="70%">
          <v-card-title style="font-weight:bold;">
            For {{ month }} {{ year }} so far, we have:
          </v-card-title>
          <v-layout align-center>
            <v-card-text>
              <p style="color:black;font-size:20px">
                Taken care of <b>{{ num_pets }}</b> pets in
                {{ num_pet_days }} days. <br />
                Earned <b>SGD {{ amount_earned }}</b
                >. <br />
                Our caretakers have earned <b>SGD {{ caretakers_salary }}.</b>
                <br />
              </p>
            </v-card-text>
          </v-layout>
        </v-card>
      </template>
    </div>
  </v-container>
</template>

<script>
import PcsAdminNavBar from "./PcsAdminNavBar";

export default {
  name: "PcsAdminHome",

  components: {
    PcsAdminNavBar,
  },
  data: () => ({
    loaded: true,
    username: null,
    month: null,
    year: null,
    num_pets: 0,
    num_pet_days: 0,
    amount_earned: 0,
    caretakers_salary: 0,
  }),
  async mounted() {
    this.username = document.cookie.split("=")[1];
    let date = new Date();
    this.month = date.toString().split(" ")[1];
    this.year = date.getFullYear();
  },
};
</script>
