<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h2>{{ username }}</h2>
        <br />
        <h3>Edit {{ pet_name }}'s Information</h3>
        <br />
        <v-layout align-center>
          <v-col>
            <b>Name:</b>
            <v-text-field v-model="pet_name" outlined readonly />
            <br />
            <b>Date of Birth:</b>
            <v-text-field v-model="pet_birth_date" outlined readonly />
            <br />
            <b>Age:</b>
            <v-text-field v-model="pet_age" outlined readonly />
            <b>Gender:</b>
            <v-text-field v-model="pet_gender" outlined readonly />
            <b>Breed:</b>
            <v-text-field v-model="pet_breed" outlined readonly />
            <b>Type of Animal:</b>
            <v-text-field v-model="pet_type_of_animal" outlined readonly />
            <b>Medical History:</b>
            <v-textarea
              v-model="pet_med_hist"
              label="Enter Medical History"
              value="pet_med_hist"
              outlined
              auto-grow
              clearable
              @click:clear="clearMedHist"
            />
            <b>Special Requirements:</b>
            <v-textarea
              v-model="pet_special_req"
              label="Enter Any Special Requirements"
              value="pet_special_req"
              outlined
              auto-grow
              clearable
              @click:clear="clearSpecialReq"
            />
          </v-col>
        </v-layout>
        <v-btn icon color="blue" fab @click="submit">
          <v-icon> mdi-content-save</v-icon>
          Save
        </v-btn>
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
import * as constants from "../constants";

export default {
  name: "PetOwnerEditPetProfile",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: true,
    username: null,
    pet_owner_name: null,
    pet_name: null,
    pet_age: null,
    pet_birth_date: null,
    pet_gender: null,
    pet_breed: null,
    pet_type_of_animal: null,
    pet_med_hist: null,
    pet_special_req: null,
  }),
  methods: {
    clearMedHist: function() {
      this.pet_med_hist = null;
    },
    clearSpecialReq: function() {
      this.pet_special_req = null;
    },
    submit: function() {
      if (this.pet_med_hist != null) {
        this.pet_med_hist = this.pet_med_hist.replace(/"/g, "");
        this.pet_med_hist = this.pet_med_hist.replace(/\n/g, " ");
        var med_hist = '"' + this.pet_med_hist + '"';
      } else {
        med_hist = null;
      }

      if (this.pet_special_req != null) {
        this.pet_special_req = this.pet_special_req.replace(/"/g, "");
        this.pet_special_req = this.pet_special_req.replace(/\n/g, " ");
        var special_req = '"' + this.pet_special_req + '"';
      } else {
        special_req = null;
      }
      const dataToSend =
        '{"pet_owner_name":"' +
        this.pet_owner_name +
        '", "pet_name":"' +
        this.pet_name +
        '", "med_hist":' +
        med_hist +
        ', "special_req":' +
        special_req +
        "}";
      console.log(dataToSend);
      const jsonDataToSend = JSON.parse(dataToSend);
      console.log(jsonDataToSend);
      window.location.href = constants.pet_owner_view_pet_info;
    },
    fetchData: async function() {},
  },
  async mounted() {
    this.username = document.cookie.split("=")[1];
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.pet_name = urlParams.get("pet");
  },
};
</script>
