<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h2>Welcome, {{ username }}</h2>
        <br />
        <h3>My Profile</h3>
        <br />
        <v-list>
          <v-card width="70%">
            <v-card-title style="font-weight:bold;">
              Account Login Details
            </v-card-title>
            <v-layout align-center>
              <v-card-text>
                Username: {{ username }} <br />
                Password: {{ password }} <br />
              </v-card-text>
              <v-btn icon color="blue" fab @click="editLoginDetails">
                <v-icon>mdi-pencil</v-icon>
                Edit
              </v-btn>
            </v-layout>
          </v-card>
          <br />
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
              <v-btn icon color="blue" fab @click="editPersonalInfo">
                <v-icon>mdi-pencil</v-icon>
                Edit
              </v-btn>
            </v-layout>
          </v-card>
          <br />
          <v-card width="70%">
            <v-card-title style="font-weight:bold;">
              Credit Card Information
            </v-card-title>
            <v-layout align-center>
              <v-card-text>
                Credit Card Number: {{ credit_card_num }} <br />
                Cardholder's Name: {{ credit_card_name }} <br />
                Expiry Date: {{ expiry_date }} <br />
              </v-card-text>
              <v-btn icon color="blue" fab @click="editCreditCardInfo">
                <v-icon>mdi-pencil</v-icon>
                Edit
              </v-btn>
            </v-layout>
          </v-card>
          <br />
          <v-card width="70%">
            <v-card-title style="font-weight:bold;">
              Pets' Information
            </v-card-title>
            <v-layout align-center>
              <v-card-text>
                <v-list v-for="i in pets" :key="i">
                  {{ pets[i] }}
                </v-list>
              </v-card-text>
            </v-layout>
          </v-card>
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
import * as constants from "../constants";

export default {
  name: "PetOwnerViewMyProfile",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: true,
    username: null,
    password: null,
    name: null,
    age: null,
    birth_date: null,
    gender: null,
    phone: null,
    email: null,
    address: null,
    pets: [],
    credit_card_num: null,
    credit_card_name: null,
    expiry_date: null,
  }),
  methods: {
    editLoginDetails: function() {
      window.location.href = constants.pet_owner_edit_login_info;
    },
    editPersonalInfo: function() {
      window.location.href = constants.pet_owner_edit_personal_info;
    },
    editCreditCardInfo: function() {
      window.location.href = constants.pet_owner_edit_credit_card_info;
    },
    fetchData: async function() {
      // set caretaker username and pet names as links
      // set pet names as options for select
      // const response = axios.get(api)
      // console.log(response.fullTime.data)
      // console.log(response.partTime.data)
      // if (response.data.fullTime.data.length == 0 && response.partTime.data.length == 0) {
      //   this.have_data = false;
      // } else {
      // }
    },
  },
  async mounted() {},
};
</script>
