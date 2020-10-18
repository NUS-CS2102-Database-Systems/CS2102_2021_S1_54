<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h3>Edit Credit Card Details</h3>
        <br />
        <v-layout align-center>
          <v-col>
            <b>Card Number:</b>
            <v-text-field
              v-model="credit_card_num"
              label="Enter Credit Card Number"
              value="credit_card_num"
              outlined
              clearable
              @click:clear="clearCreditCardNumber"
            />
            <br />
            <b>Name of Cardholder:</b>
            <v-text-field
              v-model="credit_card_name"
              label="Enter Name of Cardholder"
              value="credit_card_name"
              outlined
              clearable
              @click:clear="clearCreditCardName"
            />
            <b>Expiry Date:</b>
            <v-text-field
              v-model="expiry_date"
              label="MM/YY"
              value="expiry_date"
              outlined
              clearable
              @click:clear="clearExpiryDate"
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
// import * as constants from "../constants";
import Swal from "sweetalert2";

export default {
  name: "PetOwnerEditCreditCardInfo",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: true,
    credit_card_num: null,
    credit_card_name: null,
    expiry_date: null,
  }),
  methods: {
    clearCreditCardNumber: function() {
      this.credit_card_num = null;
    },
    clearCreditCardName: function() {
      this.credit_card_name = null;
    },
    clearExpiryDate: function() {
      this.expiry_date = "  /  ";
    },
    submit: function() {
      let data_ok = true;
      if (this.expiry_date != null) {
        if (this.expiry_date.match(/^[0-9]{2}\/[0-9]{2}$/)) {
          let current_date = new Date();
          let current_month = current_date.getMonth();
          if (current_month.length == 1) {
            current_month = "0" + current_month.toString();
          }
          let current_year = current_date.getFullYear();
          current_year = current_year.toString();
          current_year = current_year.slice(-2);
          let expiry_date_month = this.expiry_date.split("/")[0];
          let expiry_date_year = this.expiry_date.split("/")[1];
          if (
            expiry_date_month < current_month &&
            expiry_date_year <= current_year
          ) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please provide a valid expiry date",
            });
            data_ok = false;
            this.expiry_date = null;
          } else {
            var exp_date = '"' + this.expiry_date + '"';
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please provide a valid expiry date",
          });
          data_ok = false;
          this.expiry_date = null;
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Expiry Date cannot be empty",
        });
        data_ok = false;
        this.expiry_date = null;
      }

      if (this.credit_card_name != null) {
        var card_name = '"' + this.credit_card_name + '"';
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Cardholder's Name cannot be empty",
        });
        data_ok = false;
        this.credit_card_name = null;
      }

      if (this.credit_card_num != null) {
        if (this.credit_card_num.match(/^[0-9]{16,19}$/)) {
          var card_num = '"' + this.credit_card_num + '"';
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please provide a valid credit card number",
          });
          data_ok = false;
          this.credit_card_num = null;
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Credit card number cannot be empty",
        });
        data_ok = false;
        this.credit_card_num = null;
      }

      if (data_ok == true) {
        const dataToSend =
          '{"card_number":' +
          card_num +
          ', "card_name":' +
          card_name +
          ', "expiry_date":' +
          exp_date +
          "}";
        console.log(dataToSend);
        const jsonDataToSend = JSON.parse(dataToSend);
        console.log(jsonDataToSend);
        // window.location.href = constants.pet_owner_go_back_to_profile_page;
      }
    },
    fetchData: async function() {},
  },
  async mounted() {},
};
</script>
