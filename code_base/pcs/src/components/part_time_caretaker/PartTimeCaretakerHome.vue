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
import PartTimeCaretakerNavBar from "./PartTimeCaretakerNavBar";

export default {
  name: "PartTimeCaretakerHome",
  components: {
    PartTimeCaretakerNavBar,
  },
  data: () => ({
    loaded: true,
    username: null,
    num_pets: 0,
    amount_earned: 0,
  }),
  async mounted() {
    this.username = document.cookie.split("=")[1];
    let date = new Date();
    this.month = date.toString().split(" ")[1];
    this.year = date.getFullYear();
  },
};
</script>
