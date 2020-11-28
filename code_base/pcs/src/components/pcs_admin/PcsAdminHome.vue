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
                Taken care of <b>{{ num_pets }}</b> pets and providing a revenue
                of <b>SGD {{ amount_earned }}</b> in <b>{{ num_days }}</b> days.
                <br />
                <br />
                Our caretakers have earned a total of
                <b>SGD {{ caretakers_salary }}</b> in
                <b>{{ num_pet_days }}</b> pet-days.
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
import axios from "axios";

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
    num_days: 0,
    amount_earned: 0,
    caretakers_salary: 0,
  }),
  async mounted() {
    this.username = document.cookie.split("=")[1];
    let date = new Date();
    console.log(date);
    this.month = date.toString().split(" ")[1];
    this.year = date.getFullYear();
    let first_date = new Date(date.getFullYear(), date.getMonth(), 1);
    let diff_time = date - first_date;
    this.num_days = Math.ceil(diff_time / (1000 * 60 * 60 * 24));
    let first_day = new Date(date.getFullYear(), date.getMonth(), 1)
      .toISOString()
      .substr(0, 10);

    console.log(first_day);

    await axios
      .get(
        "https://pet-care-service.herokuapp.com/pcs-admin/get-num-pets-cared-for-and-amount-earned"
      )
      .then((response) => {
        console.log(response.data);
        this.num_pets = response.data[0].num_of_pets;
        this.amount_earned = response.data[0].amount_earned;
      });

    await axios
      .get("https://pet-care-service.herokuapp.com/pcs-admin/get-num-pet-days")
      .then((response) => {
        console.log(response.data);
        this.num_pet_days = response.data[0].num_pet_days;
      });

    await axios
      .get(
        "https://pet-care-service.herokuapp.com/pcs-admin/get-caretakers-total-salary"
      )
      .then((response) => {
        console.log(response.data);
        let total_salary = response.data[0].salary + response.data[1].salary;

        if (total_salary == undefined) {
          this.caretakers_salary = 0;
        } else {
          this.caretakers_salary = total_salary;
        }
      });
    this.loaded = true;
  },
};
</script>
