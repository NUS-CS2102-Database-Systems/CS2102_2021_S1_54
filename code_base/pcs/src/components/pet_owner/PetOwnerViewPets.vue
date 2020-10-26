<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h3>My Pets' Profiles</h3>
        <v-spacer />
        <v-btn icon color="blue" fab @click="addPetInformation">
          <v-icon>mdi-plus</v-icon>
          Add Pets
        </v-btn>
        <br />
        <v-col class="mx-auto">
          <v-list v-for="i in pet_name_odd" :key="i">
            <v-row>
              <v-card width="45%">
                <v-card-title> {{ pet_name_odd[i] }} </v-card-title>
                <v-card-text>
                  Date of Birth: {{ pet_birth_date_odd[i] }} <br />
                  Age: {{ pet_age_odd[i] }} <br />
                  Gender: {{ pet_gender_odd[i] }} <br />
                  Breed: {{ pet_breed_odd[i] }} <br />
                  Type of Animal: {{ type_of_animal_odd[i] }}
                  <br />
                  Medical History: {{ pet_med_hist_odd[i] }}
                  <br />
                  Special Requirements: {{ pet_special_req_odd[i] }} <br />
                </v-card-text>
              </v-card>
            </v-row>
          </v-list>
        </v-col>
        <v-spacer />
        <v-col class="mx-auto">
          <v-list v-for="i in pet_name_even" :key="i">
            <v-row>
              <v-card width="45%">
                <v-card-title> {{ pet_name_even[i] }} </v-card-title>
                <v-layout align-center>
                  <v-card-text>
                    Date of Birth: {{ pet_birth_date_even[i] }} <br />
                    Age: {{ pet_age_even[i] }} <br />
                    Gender: {{ pet_gender_even[i] }} <br />
                    Breed: {{ pet_breed_even[i] }} <br />
                    Type of Animal: {{ type_of_animal_even[i] }}
                    <br />
                    Medical History: {{ pet_med_hist_even[i] }}
                    <br />
                    Special Requirements: {{ pet_special_req_even[i] }} <br />
                  </v-card-text>
                  <br />
                  <v-btn
                    icon
                    color="blue"
                    fab
                    @click="editPetInformation(pet_name)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                    Edit
                  </v-btn>
                  <v-spacer />
                  <v-btn
                    icon
                    color="red"
                    fab
                    @click="deletePetInformation(pet_name)"
                  >
                    <v-icon>mdi-delete</v-icon>
                    Delete
                  </v-btn>
                </v-layout>
              </v-card>
            </v-row>
          </v-list>
        </v-col>
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
  name: "PetOwnerViewPets",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: false,
    username: null,
    pet_name_even: [],
    pet_age_even: [],
    pet_birth_date_even: [],
    pet_gender_even: [],
    pet_breed_even: [],
    type_of_animal_even: [],
    pet_med_hist_even: [],
    pet_special_req_even: [],
    pet_name_odd: [],
    pet_age_odd: [],
    pet_birth_date_odd: [],
    pet_gender_odd: [],
    pet_breed_odd: [],
    type_of_animal_odd: [],
    pet_med_hist_odd: [],
    pet_special_req_odd: [],
  }),
  methods: {
    addPetInformation: function() {
      window.location.href = constants.pet_owner_add_pet_info + document.cookie;
    },
    editPetInformation: function(pet_name) {
      let pet_name_to_edit = "&pet=" + pet_name;
      window.location.href =
        constants.pet_owner_edit_pet_info + document.cookie + pet_name_to_edit;
    },
    deletePetInformation: function(pet_name) {
      console.log(pet_name);
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          // axios to delete info
          const info_delete = {
            username: this.username,
            pet: pet_name,
          };

          axios
            .post("/pet-owners/delete-pet-information", {
              toDelete: info_delete,
            })
            .then((response) => {
              if (response.data[0].exists == "f") {
                Swal.fire({
                  icon: "success",
                  title: "Deleted!",
                  text:
                    pet_name + "'s information has been deleted successfully.",
                });
                window.location.reload();
              }
            });
        }
      });
    },
  },
  async mounted() {
    console.log("C_Profile: " + document.cookie);
    this.username = document.cookie.split("=")[1];
    const get_info = {
      pet_owner: this.username,
    };

    await axios
      .post("/pet-owners/get-pet-information", {
        toGet: get_info,
      })
      .then((response) => {
        let length = response.data.length;
        for (let i = 0; i < length; i++) {
          if (i % 2 == 0) {
            this.pet_name_odd.push(response.data[i].pet_name);
            this.pet_age_odd.push(response.data[i].age);
            this.pet_birth_date_odd.push(response.data[i].birth_date);
            this.pet_gender_odd.push(response.data[i].gender);
            this.pet_breed_odd.push(response.data[i].breed);
            this.type_of_animal_odd.push(response.data[i].type_of_animal);
            this.pet_med_hist_odd.push(response.data[i].med_hist);
            this.pet_special_req_odd.push(response.data[i].special_req);
          } else {
            this.pet_name_even.push(response.data[i].pet_name);
            this.pet_age_even.push(response.data[i].age);
            this.pet_birth_date_even.push(response.data[i].birth_date);
            this.pet_gender_even.push(response.data[i].gender);
            this.pet_breed_even.push(response.data[i].breed);
            this.type_of_animal_even.push(response.data[i].type_of_animal);
            this.pet_med_hist_even.push(response.data[i].med_hist);
            this.pet_special_req_even.push(response.data[i].special_req);
          }
        }
      });
    this.loaded = true;
  },
};
</script>
