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
            <b>pet_age:</b>
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
        <v-row>
          <v-col class="mx-auto">
            <v-btn icon color="blue" fab @click="submit">
              <v-icon> mdi-content-save</v-icon>
              Save
            </v-btn>
          </v-col>
          <v-col class="mx-auto">
            <v-btn icon color="red" fab @click="cancel">
              <v-icon> mdi-close</v-icon>
              Cancel
            </v-btn>
          </v-col>
        </v-row>
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
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "PetOwnerEditPetProfile",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: false,
    username: null,
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
    cancel: function() {
      window.location.href = constants.pet_owner_view_pet_info;
    },
    submit: async function() {
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
        '{"username":"' +
        this.username +
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
      await axios
        .post(
          "https://pet-care-service.herokuapp.com/pet-owners/edit-specific-pet-information",
          {
            toEdit: jsonDataToSend,
          }
        )
        .then((response) => {
          console.log(response.data);
          if (
            response.data[0].med_hist == this.pet_med_hist &&
            response.data[0].special_req == this.pet_special_req
          ) {
            Swal.fire({
              icon: "success",
              title: "Updated!",
              text:
                this.pet_name + "'s information has been updated successfully.",
            });
            window.location.href = constants.pet_owner_view_pet_info;
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text:
                this.pet_name +
                "'s information update failed. Please try again",
            });
          }
        });
    },
  },
  async mounted() {
    this.username = document.cookie.split("=")[1];
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.pet_name = urlParams.get("pet");
    const get_info = {
      username: this.username,
      pet_name: this.pet_name,
    };

    await axios
      .post(
        "https://pet-care-service.herokuapp.com/pet-owners/get-specific-pet-information",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        if (response.data[0].pet_age.years != undefined) {
          this.pet_age = response.data[0].pet_age.years + " years ";
        }

        if (
          response.data[0].pet_age.months != undefined &&
          this.pet_age == null
        ) {
          this.pet_age = response.data[0].pet_age.months + " months ";
        } else if (
          response.data[0].pet_age.months != undefined &&
          this.pet_age != null
        ) {
          this.pet_age += response.data[0].pet_age.months + " months ";
        }

        if (
          response.data[0].pet_age.days != undefined &&
          this.pet_age == null
        ) {
          this.pet_age = response.data[0].pet_age.days + " days";
        } else if (
          response.data[0].pet_age.days != undefined &&
          this.pet_age != null
        ) {
          this.pet_age += response.data[0].pet_age.days + " days";
        }

        this.pet_birth_date = response.data[0].birth_date
          .toString()
          .split("T")[0];
        this.pet_gender = response.data[0].gender;
        this.pet_breed = response.data[0].breed;
        this.pet_type_of_animal = response.data[0].type_of_animal;
        if (response.data[0].med_hist == "null") {
          this.pet_med_hist = null;
        } else {
          this.pet_med_hist = response.data[0].med_hist;
        }

        if (response.data[0].special_req == "null") {
          this.pet_special_req = null;
        } else {
          this.pet_special_req = response.data[0].special_req;
        }
      });
    this.loaded = true;
  },
};
</script>
