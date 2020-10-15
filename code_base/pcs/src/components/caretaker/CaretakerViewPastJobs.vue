<template>
  <v-container>
    <div style="width: 20%; float: left">
      <CaretakerNavBar />
    </div>
    <div style="width: 80%; float: right"></div>
  </v-container>
</template>

<script>
import CaretakerNavBar from "./CaretakerNavBar";

export default {
  name: "CaretakerViewPastJobs",

  components: {
    CaretakerNavBar,
  },
};
</script>
