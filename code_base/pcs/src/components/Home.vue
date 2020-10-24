<template>
  <v-container>
    <GeneralNavBar />
  </v-container>
</template>

<script>
import GeneralNavBar from "./General_NavBar";

export default {
  name: "Home",

  components: {
    GeneralNavBar,
  },
  async mounted() {
    var allCookies = document.cookie.split(";");
    console.log("Cookies: " + allCookies);

    // The "expire" attribute of every cookie is
    // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
    for (var i = 0; i < allCookies.length; i++) {
      console.log("Cookies Log Out i: " + allCookies[i]);
      document.cookie = allCookies[i] + ";max-age=0";
      console.log("In Log Out loop: " + document.cookie);
    }

    console.log("Log Out cookies after delete: " + document.cookie);
  },
};
</script>
