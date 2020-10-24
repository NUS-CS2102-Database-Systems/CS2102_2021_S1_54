<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PartTimeCaretakerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <br />
        <h3>Edit Account Login Details</h3>
        <br />
        <v-layout align-center>
          <v-col>
            <b>Username:</b>
            <v-text-field
              v-model="username"
              value="username"
              outlined
              readonly
            />
            <br />
            <b>New Password:</b>
            <v-text-field
              v-model="new_password"
              :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show_password ? 'text' : 'password'"
              label="Enter New Password"
              outlined
              clearable
              @click:clear="clearNewPassword"
              @click:append="show_password = !show_password"
            />
            <br />
            <b>Confirm Password:</b>
            <v-text-field
              v-model="confirm_new_password"
              :append-icon="show_confirm_password ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show_confirm_password ? 'text' : 'password'"
              label="Confirm New Password"
              outlined
              clearable
              @click:clear="clearConfirmPassword"
              @click:append="show_confirm_password = !show_confirm_password"
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
import PartTimeCaretakerNavBar from "./PartTimeCaretakerNavBar";
import * as constants from "../constants";
import Swal from "sweetalert2";

export default {
  name: "PartTimeCaretakerEditLoginInfo",

  components: {
    PartTimeCaretakerNavBar,
  },
  data: () => ({
    loaded: true,
    username: null,
    new_password: null,
    confirm_new_password: null,
    show_password: false,
    show_confirm_password: false,
  }),
  methods: {
    clearNewPassword: function() {
      this.new_password = null;
    },
    clearConfirmPassword: function() {
      this.confirm_new_password = null;
    },
    cancel: function() {
      window.location.href =
        constants.part_time_caretaker_go_back_to_profile_page;
    },
    submit: function() {
      if (this.confirm_new_password == null && this.new_password != null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please confirm password",
        });
      } else if (this.new_password != this.confirm_new_password) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Passwords do not match",
        });
        this.confirm_new_password = null;
      } else {
        console.log(this.new_password);
        console.log(this.confirm_new_password);
        window.location.href =
          constants.part_time_caretaker_go_back_to_profile_page;
      }
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
  async mounted() {
    this.username = document.cookie.split("=")[1];
  },
};
</script>
