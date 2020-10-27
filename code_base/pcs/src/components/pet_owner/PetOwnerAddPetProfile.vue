<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h2>{{ username }}</h2>
        <br />
        <h3>Add Pet Information</h3>
        <br />
        <v-layout align-center>
          <v-col>
            <b>Name:</b>
            <v-text-field
              v-model="pet_name"
              label="Enter Pet Name"
              outlined
              clearable
              @click:clear="clearPetName"
            />
            <br />
            <b>Date of Birth:</b>
            <v-menu
              v-model="dateMenu"
              :nudge-right="40"
              :close-on-content-click="true"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  label="Choose Pet's Date of Birth"
                  :value="dateDisp"
                  v-on="on"
                  clearable
                  filled
                  dense
                  color="#000000"
                  @click:clear="clearDate"
                />
              </template>
              <v-date-picker v-model="dateVal" :max="getEndDate" />
            </v-menu>
            <br />
            <b>Gender:</b>
            <v-select
              v-model="pet_gender"
              :items="genders"
              item-text="name"
              item-value="value"
              outlined
              label="Select Pet's Gender"
              dense
              color="#000000"
            />
            <b>Breed:</b>
            <v-text-field
              v-model="pet_breed"
              label="Enter Pet's Breed"
              outlined
              clearable
              @click:clear="clearPetBreed"
            />
            <b>Type of Animal:</b>
            <v-select
              v-model="pet_type_of_animal"
              :items="animal_types"
              item-text="name"
              item-value="value"
              outlined
              label="Select Type of Animal"
              dense
              color="#000000"
            />
            <b>Medical History:</b>
            <v-textarea
              v-model="pet_med_hist"
              label="Enter Medical History"
              outlined
              auto-grow
              clearable
              @click:clear="clearMedHist"
            />
            <b>Special Requirements:</b>
            <v-textarea
              v-model="pet_special_req"
              label="Enter Any Special Requirements"
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
        <v-layout align-right>
          <v-btn icon color="red" fab @click="cancel">
            <v-icon> mdi-close</v-icon>
            Cancel
          </v-btn>
        </v-layout>
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
import Swal from "sweetalert2";
import axios from "axios";

export default {
  name: "PetOwnerAddPetProfile",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: true,
    username: null,
    pet_name: null,
    pet_age: null,
    pet_gender: null,
    pet_breed: null,
    pet_type_of_animal: null,
    pet_med_hist: null,
    pet_special_req: null,
    dateMenu: false,
    dateVal: null,
    getEndDate: new Date().toISOString().substr(0, 10),
    genders: [
      { name: "Male", value: "M" },
      { name: "Female", value: "F" },
    ],
    animal_types: [
      { name: "Cat", value: "Cat" },
      { name: "Small Dog", value: "Small Dog" },
      { name: "Big Dog", value: "Big Dog" },
      { name: "Bird", value: "Bird" },
      { name: "Rodent", value: "Rodent" },
    ],
  }),
  computed: {
    dateDisp() {
      return this.dateVal;
    },
  },
  methods: {
    clearPetName: function() {
      this.pet_name = null;
    },
    clearDate: function() {
      this.dateVal = null;
    },
    clearPetBreed: function() {
      this.pet_breed = null;
    },
    clearMedHist: function() {
      this.pet_med_hist = null;
    },
    clearSpecialReq: function() {
      this.pet_special_req = null;
    },
    cancel: function() {
      window.location.href = constants.pet_owner_view_pet_info;
    },
    submit: function() {
      let data_ok = true;

      if (this.pet_name == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Name of Pet cannot be empty!",
        });
        data_ok = false;
      } else {
        let name_lowercase = this.pet_name.toString().toLowerCase();
        this.pet_name = name_lowercase.replace(
          /(^\w{1})|(\s{1}\w{1})/g,
          (match) => match.toUpperCase()
        );
        var new_name = '"' + this.pet_name + '"';
      }

      if (this.dateVal == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Pet's Date of Birth cannot be empty!",
        });
        data_ok = false;
      }

      if (this.pet_gender == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gender of Pet cannot be empty!",
        });
        data_ok = false;
      }

      if (this.pet_breed == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Breed of Pet cannot be empty!",
        });
        data_ok = false;
      } else {
        let breed__lowercase = this.pet_breed.toString().toLowerCase();
        this.pet_breed = breed__lowercase.replace(
          /(^\w{1})|(\s{1}\w{1})/g,
          (match) => match.toUpperCase()
        );
        var new_breed = '"' + this.pet_breed + '"';
      }

      if (this.pet_type_of_animal == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Type of Animal cannot be empty!",
        });
        data_ok = false;
      }

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

      if (data_ok == true) {
        const dataToSend =
          '{"username":"' +
          this.username +
          '", "pet_name":' +
          new_name +
          ', "birth_date":"' +
          this.dateVal +
          '", "gender":"' +
          this.pet_gender +
          '", "breed":' +
          new_breed +
          '", "animal_type":"' +
          this.pet_type_of_animal +
          '", "med_hist":' +
          med_hist +
          ', "special_req":' +
          special_req +
          "}";
        console.log(dataToSend);
        const jsonDataToSend = JSON.parse(dataToSend);
        console.log(jsonDataToSend);
        axios
          .post("/pet-owners/add-pet-information", {
            toAdd: jsonDataToSend,
          })
          .then((response) => {
            if (response.data[0].exists == "t") {
              Swal.fire({
                icon: "success",
                title: "Added!",
                text: this.pet_name + "'s information has been added successfully.",
              });
              window.location.href = constants.pet_owner_view_pet_info;
            }
          });
      }
    },
  },
  async mounted() {
    console.log(document.cookie);
    this.username = document.cookie.split("=")[1];
  },
};
</script>
