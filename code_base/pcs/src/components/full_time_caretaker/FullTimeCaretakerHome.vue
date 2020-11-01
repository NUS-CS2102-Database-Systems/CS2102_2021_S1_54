<template>
  <v-container>
    <div style="width: 20%; float: left">
      <FullTimeCaretakerNavBar />
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
import FullTimeCaretakerNavBar from "./FullTimeCaretakerNavBar";

export default {
  name: "FullTimeCaretakerHome",
  components: {
    FullTimeCaretakerNavBar,
  },
  data: () => ({
    loaded: true,
    username: null,
  }),
  async mounted() {
    this.username = document.cookie.split("=")[1];
  },
};
</script>
