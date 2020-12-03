<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h2>{{ username }}</h2>
        <br />
        <h3>Place A Caretaking Bid For {{ caretaker }}</h3>
        <br />
        <v-layout align-center>
          <v-row>
            <v-col>
              <H3>Select Pet:</H3>
              <template v-if="pet_arr.length != 0">
                <v-select
                  :items="pet_arr"
                  label="Select Pet"
                  item-text="name"
                  outlined
                  v-model="pet_selected"
                  @input="setPetPriceRate"
                ></v-select>
              </template>

              <template v-else>
                <v-select disabled label="No Pets Suitable" outlined></v-select>
              </template>
              <p v-if="price_rate != null">
                Price rate for {{ pet_selected }} is ${{ price_rate }} SGD/day.
              </p>
              <br />
              <br />

              <H3>Select Caretaking Dates:</H3>
              <p>Select Start Date and End Date in the calendar below</p>
              <v-row>
                <v-col>
                  <v-date-picker
                    v-model="selected_dates"
                    range
                    :min="today_date"
                    @input="setNumOfDays"
                  ></v-date-picker>
                  <!-- :allowed-dates="allowedDates" -->
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="dateRangeText"
                    label="Selected Date Range"
                    prepend-icon="mdi-calendar"
                    readonly
                  ></v-text-field>
                  <p v-if="num_pet_days != null">
                    Number of pet-days: {{ num_pet_days }}
                  </p>
                  <p v-else-if="num_pet_days == null">
                    Select two dates - Start Date and End Date!
                  </p>
                </v-col>
              </v-row>
              <br />

              <H3>Select Transfers Time</H3>
              <v-row>
                <v-col cols="12" sm="6">
                  <b>Start:</b>
                  <br />
                  <v-time-picker
                    v-model="start_time"
                    :landscape="$vuetify.breakpoint.smAndUp"
                    ampm-in-title
                  ></v-time-picker>
                </v-col>
                <v-col cols="12" sm="6">
                  <b>End:</b>
                  <br />
                  <v-time-picker
                    v-model="end_time"
                    :landscape="$vuetify.breakpoint.smAndUp"
                    ampm-in-title
                  ></v-time-picker>
                </v-col>
              </v-row>

              <br />
              <br />
              <br />
              <H3>Select Transfers Method</H3>
              <v-row align="center">
                <v-col>
                  <b>Start:</b>
                  <v-select
                    v-if="method_to_arr != null"
                    :items="method_to_arr"
                    label="Select Transfer To Method"
                    item-text="mtd"
                    outlined
                    v-model="start_method"
                  ></v-select>
                  <v-select
                    v-else
                    disabled
                    label="No Transfer Method Available"
                    outlined
                  ></v-select>
                </v-col>
                <v-col>
                  <b>End:</b>
                  <v-select
                    v-if="method_from_arr != null"
                    :items="method_from_arr"
                    label="Select Transfer From Method"
                    item-text="mtd"
                    outlined
                    v-model="end_method"
                  ></v-select>
                  <v-select
                    v-else
                    disabled
                    label="No Transfer Method Available"
                    outlined
                  ></v-select>
                </v-col>
              </v-row>
              <br />
              <br />
              <p v-if="price != null">
                Total price is ${{ price }} SGD for {{ num_pet_days }} days.
              </p>
              <br />
            </v-col>
          </v-row>
        </v-layout>
        <br />
        <br />
        <v-layout align-right>
          <v-row>
            <v-col>
              <v-btn icon color="red" fab @click="cancel">
                <v-icon> mdi-close</v-icon>
                Cancel
              </v-btn>
            </v-col>

            <v-col>
              <v-btn color="success" dark @click="paybycash">
                Pay By Cash
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="success" dark @click="paybycard">
                Pay By Registered Credit Card
              </v-btn>
            </v-col>
          </v-row>
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
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "PetOwnerBidCaretaker",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: false,
    //loaded: true,
    today_date: null,

    username: null,
    caretaker: null,

    pet_arr: [],
    //pet_arr: ["a", "b", "c"],
    dict_pet_price: {},
    pet_selected: null,
    price_rate: null,

    selected_dates: null,
    num_pet_days: null,
    start_time: null,
    end_time: null,

    method_to_arr: [
      { mtd: "Pet Owner Deliver" },
      { mtd: "Care Taker Pickup" },
      { mtd: "Transfer through PCS Building" },
    ],
    start_method: null,
    method_from_arr: [
      { mtd: "Pet Owner Pickup" },
      { mtd: "Care Taker Deliver" },
      { mtd: "Transfer through PCS Building" },
    ],
    end_method: null,

    price: null,
    // payment_method: null,
  }),
  computed: {
    dateRangeText() {
      if (this.selected_dates != null) return this.selected_dates.join(" ~ ");
      else return "";
    },
  },
  methods: {
    // allowedDates: val => parseInt(val.split('-')[2], 10) % 2 === 0,
    setPetPriceRate: function() {
      this.price_rate = this.dict_pet_price[this.pet_selected];

      if (this.num_pet_days != null) {
        this.price = this.price_rate * this.num_pet_days;
      }
    },

    setNumOfDays: function() {
      if (this.selected_dates.length == 2) {
        this.selected_dates.sort();
        let date1 = new Date(this.selected_dates[0]);
        let date2 = new Date(this.selected_dates[1]);
        const diffTime = Math.abs(date2 - date1);
        this.num_pet_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (this.price_rate != null) {
          this.price = this.price_rate * this.num_pet_days;
        }
      } else {
        this.price = null;
        this.num_pet_days = null;
      }
    },

    cancel: function() {
      window.location.href = constants.pet_owner_view_caretaker_domain;
    },

    paybycard: async function() {
      //Check all fills are filled
      let data_ok = true;
      if (this.pet_selected == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select a pet",
        });
        data_ok = false;
      } else if (
        this.selected_dates == null ||
        this.selected_dates == undefined ||
        this.selected_dates[0] == null ||
        this.selected_dates[1] == null 
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select a pair of start date and end date",
        });
        data_ok = false;
      } else if (this.start_time == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select the start time",
        });
        data_ok = false;
      } else if (this.end_time == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select the end time",
        });
        data_ok = false;
      } else if (this.start_method == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select starting transfer method",
        });
        data_ok = false;
      } else if (this.end_method == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select ending transfer method",
        });
        data_ok = false;
      }

      if (
        this.selected_dates[0] == this.selected_dates[1] &&
        this.end_time < this.start_time
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            "Please ensure that the start time is after the end time for single day booking",
        });
        data_ok = false;
      }

      if (data_ok == true) {
        // Check if person have credit card
        let valid_card = false;
        const get_info = {
          username: this.username,
        };

        await axios
          .post(
            "https://pet-care-service.herokuapp.com/pet-owners/view-caretakers-profiles/bid/able-to-pay_by-card",
            {
              toGet: get_info,
            }
          )
          .then((response) => {
            console.log(response.data);
            if (response.data[0].valid_card != 1) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text:
                  "You do not have a card linked to your Petopia account. Please proceed to 'My Profile' and add your credit card details.",
              });
            } else {
              valid_card = true;
            }
          });

        if (valid_card == true) {
          // Insert into db

          // Get current datetime
          let date = new Date();

          var startDateObj = new Date(this.selected_dates[0]);
          startDateObj.setHours(this.start_time.split(":")[0]);
          startDateObj.setMinutes(this.start_time.split(":")[1]);

          var endDateObj = new Date(this.selected_dates[1]);
          endDateObj.setHours(this.end_time.split(":")[0]);
          endDateObj.setMinutes(this.end_time.split(":")[1]);

          date.setHours(date.getHours() + 8);
          startDateObj.setHours(startDateObj.getHours() + 8);
          endDateObj.setHours(endDateObj.getHours() + 8);

          const send_info = {
            username: this.username,
            pet: this.pet_selected,
            caretaker: this.caretaker,
            bidding_time: date
              .toISOString()
              .toString()
              .replace(/T/, " ")
              .substring(0, 19), 
            job_start_datetime: startDateObj
              .toISOString()
              .toString()
              .replace(/T/, " ")
              .substring(0, 19),
            job_end_datetime: endDateObj
              .toISOString()
              .toString()
              .replace(/T/, " ")
              .substring(0, 19),
            payment_datetime: date
              .toISOString()
              .toString()
              .replace(/T/, " ")
              .substring(0, 19), 
            amount: this.price,
            payment_method: "Credit Card",
            start_transfer_method: this.start_method,
            end_transfer_method: this.end_method,
          };

          date.setHours(date.getHours() - 8);
          startDateObj.setHours(startDateObj.getHours() - 8);
          endDateObj.setHours(endDateObj.getHours() - 8);

          console.log(send_info);

          await axios
            .post(
              "https://pet-care-service.herokuapp.com/pet-owners/view-caretakers-profiles/bid/pay",
              {
                toBid: send_info,
              }
            )
            .then((response) => {
              console.log("response");
              console.log(typeof response);
              console.log(response);
              console.log(response.data);
              console.log(response.data[0]);
              console.log(response.data[0].result);
              if (response.data[0].result == 1) {
                Swal.fire({
                  icon: "success",
                  title: "Sucessfully bidded!",
                  text:
                    this.pet_selected +
                    "'s bid with " +
                    this.caretaker +
                    " starting from " +
                    this.selected_dates[0] +
                    " till " +
                    this.selected_dates[1] +
                    " is confirmed. Thank you!",
                }).then(function() {
                  window.location.href = constants.pet_owner_view_upcoming_jobs;
                });
              } else if (response.data[0].result == 2) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text:
                    this.pet_selected +
                    "'s bid with " +
                    this.caretaker +
                    " starting from " +
                    this.selected_dates[0] +
                    " till " +
                    this.selected_dates[1] +
                    " already exist!",
                });
              
              } else if (response.data[0] == null) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text:
                    "Missed Bid! Please try another bid or contact the Admin. Error: " +
                    response,
                });
              } else if (response.data[0].result == null) {
                console.log("Inside response.data[0].result == null")
                console.log(response.data)
                console.log(typeof response.data)
                console.log(response.data.substr(0, 12))
                console.log(response.data.trim() === "Error error: ".trim())
                if (response.data.toString().trim() === 'Error error: new row for relation "bid_transaction" violates check constraint "bid_transaction_check2"'.trim()){
                  response.data = "Job start timing should be after current time.";
                  console.log(response.data);
                }
                else if (response.data.toString().trim() === 'Error error: new row for relation "bid_transaction" violates check constraint "bid_transaction_check1"'.trim()){
                  response.data = "Job start timing should be after current time.";
                  console.log(response.data);
                }
                else if (response.data.substr(0, 12).trim() === "Error error: ".trim()) {
                  response.data = response.data.substr(13);
                  console.log(response.data);
                }
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text:
                    "Missed Bid! Please try another bid: " +
                    response.data,
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Missed Bid! Please try another bid or contact the Admin. Error: " + response.data[0],
                });
              }
            });
        }
      }
    },
    paybycash: async function() {
      //Check all fills are filled
      console.log(this.selected_dates)
      let data_ok = true;
      if (this.pet_selected == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select a pet",
        });
        data_ok = false;
      } else if (
        this.selected_dates == null ||
        this.selected_dates == undefined ||
        this.selected_dates[0] == null ||
        this.selected_dates[1] == null 
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select a pair of start date and end date",
        });
        data_ok = false;
      } else if (this.start_time == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select the start time",
        });
        data_ok = false;
      } else if (this.end_time == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select the end time",
        });
        data_ok = false;
      } else if (this.start_method == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select starting transfer method",
        });
        data_ok = false;
      } else if (this.end_method == null) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please select ending transfer method",
        });
        data_ok = false;
      }
      // Single day booking would have ending time after starting time
      if (
        this.selected_dates[0] == this.selected_dates[1] &&
        this.end_time < this.start_time
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            "Please ensure that the start time is after the end time for single day booking",
        });
        data_ok = false;
      }

      if (data_ok == true) {
        // Insert into db

        // Get current datetime
        let date = new Date();
        //let hours = date.setHours(date.getHours() + 8);
        //date.setHours(date.getHours() + 8);

        // let sg_bid_date = date.toISOString().toString();
        // sg_bid_date = sg_bid_date.replace(/T/, " ");
        // sg_bid_date = sg_bid_date.substring(0, sg_bid_date.length - 1);

        // console.log("hiiii");
        // console.log(date);
        // console.log(sg_bid_date);
        // console.log("next selected dates");
        // console.log(this.selected_dates[0]);
        // console.log(this.selected_dates[1]);

        // Format date and time into datetime for db
        // var startTimeString = this.start_time.hour + ':' + this.start_time.minute + ':00';
        var startDateObj = new Date(this.selected_dates[0]); // + ' ' + startTimeString);
        // console.log(this.start_time)
        // console.log(this.start_time.split(":")[0])
        // console.log(this.start_time.split(":")[1])
        startDateObj.setHours(this.start_time.split(":")[0]);
        startDateObj.setMinutes(this.start_time.split(":")[1]);
        // var startDateStr = startDateStr.replace(/T/, " ");
        // startDateStr = startDateStr.substring(0, startDateStr - 1);

        // var endTimeString = this.end_time.hour + ':' + this.end_time.minute + ':00';
        var endDateObj = new Date(this.selected_dates[1]); // + ' ' + endTimeString);
        endDateObj.setHours(this.end_time.split(":")[0]);
        endDateObj.setMinutes(this.end_time.split(":")[1]);
        // var endDateStr = endDateStr.replace(/T/, " ");
        // endDateStr = endDateStr.substring(0, endDateStr - 1);

        // console.log(startDateObj)
        // console.log(endDateObj)

        date.setHours(date.getHours() + 8);
        startDateObj.setHours(startDateObj.getHours() + 8);
        endDateObj.setHours(endDateObj.getHours() + 8);

        const send_info = {
          username: this.username,
          pet: this.pet_selected,
          caretaker: this.caretaker,
          bidding_time: date
            .toISOString()
            .toString()
            .replace(/T/, " ")
            .substring(0, 19), 
          job_start_datetime: startDateObj
            .toISOString()
            .toString()
            .replace(/T/, " ")
            .substring(0, 19),
          job_end_datetime: endDateObj
            .toISOString()
            .toString()
            .replace(/T/, " ")
            .substring(0, 19),
          payment_datetime: startDateObj
            .toISOString()
            .toString()
            .replace(/T/, " ")
            .substring(0, 19),
          amount: this.price,
          payment_method: "Cash",
          start_transfer_method: this.start_method,
          end_transfer_method: this.end_method,
        };

        date.setHours(date.getHours() - 8);
        startDateObj.setHours(startDateObj.getHours() - 8);
        endDateObj.setHours(endDateObj.getHours() - 8);

        console.log(send_info);
        await axios
          .post(
            "https://pet-care-service.herokuapp.com/pet-owners/view-caretakers-profiles/bid/pay",
            {
              toBid: send_info,
            }
          )
          .then((response) => {
            console.log("response");
            console.log(typeof response);
            console.log(response);
            console.log(response.data);
            console.log(response.data[0]);
            console.log(response.data[0].result);
            if (response.data[0].result == 1) {
              Swal.fire({
                icon: "success",
                title: "Sucessfully bidded!",
                text:
                  this.pet_selected +
                  "'s bid with " +
                  this.caretaker +
                  " starting from " +
                  this.selected_dates[0] +
                  " till " +
                  this.selected_dates[1] +
                  " is comfirmed. Please pay $" +
                  this.price +
                  " to the caretaker upon the start of the caretaking session. Thank you!",
              }).then(function() {
                window.location.href = constants.pet_owner_view_upcoming_jobs;
              });
            } else if (response.data[0].result == 2) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text:
                  this.pet_selected +
                  "'s bid with " +
                  this.caretaker +
                  " starting from " +
                  this.selected_dates[0] +
                  " till " +
                  this.selected_dates[1] +
                  " already exist!",
              });
            } else if (response.data[0] == null) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text:
                  "Missed Bid! Please try another bid or contact the Admin. Null Error: " +
                  response,
              });
            } else if (response.data[0].result == null) {
              // console.log("Inside response.data[0].result == null")
              // console.log(response.data)
              // console.log(typeof response.data)
              // console.log(response.data.substr(0, 12))
              // console.log(response.data.substr(0, 12).trim() === "Error error: ".trim())
              if (response.data.toString().trim() === 'Error error: new row for relation "bid_transaction" violates check constraint "bid_transaction_check2"'.trim()){
                response.data = "Job start timing should be after current time.";
                console.log(response.data);
              }
              else if (response.data.toString().trim() === 'Error error: new row for relation "bid_transaction" violates check constraint "bid_transaction_check1"'.trim()){
                response.data = "Job start timing should be after current time.";
                console.log(response.data);
              }
              else if (response.data.substr(0, 12).trim() === "Error error: ".trim()) {
                response.data = response.data.substr(13);
                console.log(response.data);
              }
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text:
                  "Missed Bid! Please try another bid: " +
                  response.data,
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Missed Bid! Please try another bid or contact the Admin. Error: " + response.data[0],
              });
            }
          });
      }
    },
  },
  async mounted() {
    this.username = document.cookie.split("=")[1];
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.caretaker = urlParams.get("caretaker");

    let date = new Date();
    date.setHours(date.getHours() + 8);
    let sg_current_date = date.toISOString().toString();
    // date.setHours(date.getHours() + 8);
    // sg_current_date = sg_current_date.split(/T/, 2)[0];
    this.today_date = sg_current_date.split(/T/, 2)[0];
    console.log("current datetime")
    console.log(sg_current_date)
    console.log(this.today_date)

    const get_info = {
      username: this.username,
      caretaker: this.caretaker,
    };
    await axios
      .post(
        "https://pet-care-service.herokuapp.com/pet-owners/view-caretakers-profiles/bid-pets-options",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          console.log(response.data[i]);
          let pet_name_opt = {
            name: response.data[i].pet_name,
            value: response.data[i].pet_name,
          };
          this.pet_arr.push(pet_name_opt);
          this.dict_pet_price[response.data[i].pet_name] =
            response.data[i].current_daily_price;
        }
      });
    this.loaded = true;
  },
};
</script>
