<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h2>{{ caretaker_username }}'s Profile</h2>
        <br />
        <br />
        <v-list>
          <v-card width="70%">
            <v-card-title style="font-weight:bold;">
              Personal Information
            </v-card-title>
            <v-layout align-center>
              <v-card-text>
                Name: {{ name }} <br />
                Date of Birth: {{ birth_date }} <br />
                Age: {{ age }} <br />
                Gender: {{ gender }}
                <br />
                Phone: {{ phone }}
                <br />
                Email: {{ email }} <br />
                Address: {{ address }} <br />
              </v-card-text>
            </v-layout>
          </v-card>
          <br />
          <v-card width="70%">
            <v-card-title style="font-weight:bold;">
              Work Information
            </v-card-title>
            <v-layout align-center>
              <v-card-text>
                Years of Experience: {{ years_exp }} <br />
                Can Take Care of:
                <v-list v-for="i in can_take_care" :key="i">
                  {{ can_take_care[i] }}
                </v-list>
              </v-card-text>
            </v-layout>
          </v-card>
          <br />  
          <v-btn elevation="2">
            <router-link tag="span" 
              :to="{ path: '/pet-owners/view-caretaker-reviews/' + caretaker_username}">
              View Reviews
            </router-link>
          </v-btn>      
        </v-list>
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
// import axios from "axios";

export default {
  name: "PetOwnerViewCaretakerProfile",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: true,
    caretaker_username: null,
    name: null,
    birth_date: null,
    age: null,
    years_exp: null,
    gender: null,
    phone: null,
    email: null,
    address: null,
    can_take_care: [],
  }),
  methods: {
    // fetchData: async function() {
    //   const response = axios.get();
    // },
  },
  // async mounted() {},
};
</script>
