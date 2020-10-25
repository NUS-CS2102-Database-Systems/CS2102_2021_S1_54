<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PartTimeCaretakerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h2>Welcome, {{ username }}!</h2>
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
              Work Information
            </v-card-title>
            <v-layout align-center>
              <v-card-text>
                Date Started: {{ date_started }} <br />
                Years Of Experience: {{ years_exp }} <br />
                Average Rating: {{ avg_rating }} <br />
                Can Take Care Of:
                <v-list v-for="i in can_take_care" :key="i">
                  {{ can_take_care[i] }}
                  <v-spacer />
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
import PartTimeCaretakerNavBar from "./PartTimeCaretakerNavBar";
import * as constants from "../constants";

export default {
  name: "PartTimeCaretakerViewMyProfile",

  components: {
    PartTimeCaretakerNavBar,
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
    avg_rating: null,
    years_exp: null,
    date_started: null,
    can_take_care: [],
  }),
  methods: {
    editLoginDetails: function() {
      window.location.href =
        constants.part_time_caretaker_edit_login_info + document.cookie;
    },
    editPersonalInfo: function() {
      window.location.href =
        constants.part_time_caretaker_edit_personal_info + document.cookie;
    },
    fetchData: async function() {},
  },
  async mounted() {
    console.log("CT_Profile: " + document.cookie);
    this.username = document.cookie.split("=")[1];
  },
};
</script>
