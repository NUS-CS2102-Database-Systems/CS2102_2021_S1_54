<template>
  <v-container>
    <div style="width: 20%; float: left">
      <GeneralNavBar />
    </div>
    <div style="width: 80%; float: right">
      <h1 style="text-align:center">Welcome to Petopia!</h1>
      <br />
      <p style="font-size:30px">
        Need someone to help you to take care of your pet while you are away?
        Fret not, Petopia is here!<br /><br />
        At Petopia, we are commited to providing the best care for your pets.
        Established in 2000, we have around 2000 caretakers, both full-time and
        part-time at various price points to suit your needs. We cater to
        various types of pets, such as birds, big dogs, small dogs, cats,
        rabbits and rodents. <br /><br />
        What are you waiting for? Send your pets to Petopia, Care For Your Pet!
      </p>
    </div>
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
