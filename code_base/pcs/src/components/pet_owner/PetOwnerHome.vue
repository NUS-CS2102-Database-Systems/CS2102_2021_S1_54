<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h2>Welcome to Petopia, {{ username }}!</h2>
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
import PetOwnerNavBar from "./PetOwnerNavBar";

export default {
  name: "PetOwnerHome",
  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: true,
    username: null,
  }),
  async mounted() {
    console.log("C_Home: " + document.cookie);
    if (document.cookie.includes(";")) {
      let split_cookie = document.cookie.split(";");
      console.log("Home:" + split_cookie[0]);
      var get_last_cookie = split_cookie[0];
    } else {
      get_last_cookie = document.cookie;
    }
    let get_last_cookie_split = get_last_cookie.split("=");
    this.username = get_last_cookie_split[1];
    // const search = window.location.search; // returns the URL query String
    // console.log(search);
    // const params = new URLSearchParams(search);
    // this.username = params.get("pet_owner_username");
    // console.log(this.username);
  },
};
</script>
