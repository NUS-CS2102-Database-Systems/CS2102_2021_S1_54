<template>
  <v-container>
    <PetOwnerNavBar />
  </v-container>
</template>

<script>
import PetOwnerNavBar from "./PetOwnerNavBar";

export default {
  name: "PetOwnerHome",

  components: {
    PetOwnerNavBar,
  },
};
</script>
