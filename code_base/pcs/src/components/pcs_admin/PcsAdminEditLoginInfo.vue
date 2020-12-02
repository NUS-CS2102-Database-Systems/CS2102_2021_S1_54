<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PcsAdminNavBar />
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
        <v-row>
          <v-col class="mx-auto">
            <v-btn icon color="red" fab @click="cancel">
              <v-icon> mdi-close</v-icon>
              Cancel
            </v-btn>
          </v-col>
          <v-col class="mx-auto">
            <v-btn icon color="blue" fab @click="submit">
              <v-icon> mdi-content-save</v-icon>
              Save
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
import PcsAdminNavBar from "./PcsAdminNavBar";
import * as constants from "../constants";
import Swal from "sweetalert2";
import axios from "axios";

export default {
  name: "PcsAdminEditLoginInfo",

  components: {
    PcsAdminNavBar,
  },
  data: () => ({
    loaded: false,
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
      window.location.href = constants.pcs_admin_go_back_to_profile_page;
    },
    submit: async function() {
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
      } else if (
        this.new_password == null &&
        this.confirm_new_password == null
      ) {
        window.location.href = constants.pcs_admin_go_back_to_profile_page;
      } else {
        console.log(this.new_password);
        console.log(this.confirm_new_password);
        const new_login_details = {
          username: this.username,
          password: this.new_password,
        };

        await axios
          .post(
            "https://pet-care-service.herokuapp.com/pcs-admin/edit-login-information",
            {
              toEdit: new_login_details,
            }
          )
          .then((response) => {
            if (this.new_password == response.data[0].password) {
              Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Password has been updated successfully.",
              }).then(function() {
                window.location.href =
                  constants.pcs_admin_go_back_to_profile_page;
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Password update failed. Please try again",
              });
            }
          });
      }
    },
  },
  async mounted() {
    this.username = document.cookie.split("=")[1];
    const get_login_info = {
      username: this.username,
    };

    await axios
      .post(
        "https://pet-care-service.herokuapp.com/pcs-admin/get-login-information",
        {
          toGet: get_login_info,
        }
      )
      .then((response) => {
        this.password = response.data[0].password;
      });
    this.loaded = true;
  },
};
</script>
