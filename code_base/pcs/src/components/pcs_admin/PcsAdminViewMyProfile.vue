<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PcsAdminNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h2>Welcome, {{ username }}!</h2>
        <br />
        <h3>My Profile</h3>
        <br />
        <v-layout align-center>
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
import PcsAdminNavBar from "./PcsAdminNavBar";
import * as constants from "../constants";
import axios from "axios";

export default {
  name: "PcsAdminViewMyProfile",

  components: {
    PcsAdminNavBar,
  },
  data: () => ({
    loaded: false,
    username: null,
    password: null,
  }),
  methods: {
    editLoginDetails: function() {
      window.location.href =
        constants.pcs_admin_edit_login_info + document.cookie;
    },
  },
  async mounted() {
    this.username = document.cookie.split("=")[1];
    const get_info = {
      username: this.username,
    };

    axios
      .post(
        "https://pet-care-service.herokuapp.com/pcs-admin/get-login-information",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        console.log("inside response!");
        this.password = response.data[0].password;
      });
    this.loaded = true;
  },
};
</script>
