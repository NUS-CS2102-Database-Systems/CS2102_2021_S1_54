<template>
  <v-container>
    <div style="width: 20%; float: left">
      <FullTimeCaretakerNavBar />
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
                <b>{{ num_pet_days }}</b> days. <br />
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
import FullTimeCaretakerNavBar from "./FullTimeCaretakerNavBar";
import axios from "axios";

export default {
  name: "FullTimeCaretakerHome",

  components: {
    FullTimeCaretakerNavBar,
  },
  data: () => ({
    loaded: false,
    username: null,
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
        console.log(response.data.length);
        if (response.data.length == 0) {
          this.num_pet_days = 0;
          this.amount_earned = 3000;
        } else {
          if (response.data[0].pet_days == undefined) {
            this.num_pet_days = 0;
            this.amount_earned = 3000;
          } else {
            this.num_pet_days = response.data[0].pet_days;
          }
        }
      });
    this.loaded = true;
  },
};
</script>
