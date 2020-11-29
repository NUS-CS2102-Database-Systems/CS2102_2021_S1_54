<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PartTimeCaretakerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h2>Welcome to Petopia, {{ username }}!</h2>
        <br />
        <v-card width="70%">
          <v-card-title style="font-weight:bold;">
            For {{ month }} {{ year }} so far, you have:
          </v-card-title>
          <v-layout align-center>
            <v-card-text>
              <p style="color:black;font-size:20px">
                Taken care of <b>{{ num_pets }}</b> pets in
                <b>{{ num_pet_days }}</b> pet-days. <br />
                Earned <b>SGD {{ amount_earned }}</b
                >. <br />
              </p>
            </v-card-text>
          </v-layout>
        </v-card>
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
import axios from "axios";

export default {
  name: "PartTimeCaretakerHome",

  components: {
    PartTimeCaretakerNavBar,
  },
  data: () => ({
    loaded: true,
    username: null,
    month: null,
    year: null,
    num_pets: 0,
    amount_earned: 0,
    num_pet_days: 0,
  }),
  async mounted() {
    this.username = document.cookie.split("=")[1];
    let date = new Date();
    this.month = date.toString().split(" ")[1];
    this.year = date.getFullYear();

    const get_info = {
      username: this.username,
    };

    await axios
      .post(
        "https://pet-care-service.herokuapp.com/caretakers/get-num-pet-days",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        console.log(response);
        console.log(response.data);
        if (response.data.length == 0) {
          this.num_pet_days = 0;
        } else {
          this.num_pet_days = response.data[0].pet_days;
        }
      });

    await axios
      .post(
        "https://pet-care-service.herokuapp.com/part-time-caretakers/get-salary",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        console.log(response);
        console.log(response.data);
        if (response.data.length == 0) {
          this.amount_earned = 0;
        } else {
          this.amount_earned = response.data[0].salary;
        }
      });
    this.loaded = true;
  },
};
</script>
