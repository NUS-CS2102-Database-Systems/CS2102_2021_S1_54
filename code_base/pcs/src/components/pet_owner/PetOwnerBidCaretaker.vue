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
              <v-select v-if="pet_arr != NULL"
                :items="pet_arr"
                label="Select Pet"
                item-text="name"
                outlined
                v-model="pet_selected"
              ></v-select>
              <v-select v-else
                disabled
                label="No Pets Suitable"
                outlined
              ></v-select>
              <p v-if="price_rate != NULL">
                Price rate for {{pet_selected}} is ${{price_rate}} SGD/day.
              </p> 
              <br />


              <H3>Select Caretaking Dates:</H3>
              <p>Select Start Date and End Date in the calendar below</p>
              <v-row>
                <v-col>
                  <v-date-picker
                    v-model="selected_dates"
                    range
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
                    Number of pet-days: {{num_pet_days}}
                  </p>
                </v-col>
              </v-row>

              <H3>Select Transfers Time</H3>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <b>Start:</b> 
                  <br />
                  <v-time-picker
                    v-model="start_time"
                    :landscape="$vuetify.breakpoint.smAndUp"
                    ampm-in-title
                  ></v-time-picker>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
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
              <H3>Select Transfers Method</H3>
              <v-row align="center">
                <v-col>
                  <b>Start:</b> 
                  <v-select v-if="method_to_arr != NULL"
                    :items="method_to_arr"
                    label="Select Transfer To Method"
                    item-text="mtd"
                    outlined
                    v-model="start_method"
                  ></v-select>
                  <v-select v-else
                    disabled
                    label="No Transfer Method Available"
                    outlined
                  ></v-select>
                </v-col>
                <v-col>
                  <b>End:</b> 
                  <v-select v-if="method_from_arr != NULL"
                    :items="method_from_arr"
                    label="Select Transfer From Method"
                    item-text="mtd"
                    outlined
                    v-model="end_method"
                  ></v-select>
                  <v-select v-else
                    disabled
                    label="No Transfer Method Available"
                    outlined
                  ></v-select>
                </v-col>
              </v-row>

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

export default {
  name: "PetOwnerEditPetProfile",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: true,

    username: null,
    caretaker: null,

    pet_arr: null, 
    pet_selected: null,
    price_rate: null,

    selected_dates: null,
    num_pet_days: null,
    start_time: null,
    end_time: null,

    method_to_arr: [{mtd: "Pet Owner Deliver"}, {mtd: "Care Taker Pickup"}, {mtd: "Transfer thorugh PCS Building"}],
    start_method: null,
    method_from_arr: [{mtd: "Pet Owner Pickup"}, {mtd: "Care Taker Deliver"}, {mtd: "Transfer thorugh PCS Building"}],
    end_method: null,

    price: null,
    // payment_method: null,

  }),
  computed: {
    dateRangeText() {
      if (this.selected_dates != null)
        return this.selected_dates.join(' ~ ')
      else 
        return ''
    },
  },
  methods: {
    // allowedDates: val => parseInt(val.split('-')[2], 10) % 2 === 0,
    
    cancel: function() {
      window.location.href = constants.pet_owner_view_caretaker_domain;
    },
    paybycard: function(){
      
    },
    paybycash: function(){
      
    },
    submit: function() {
      // if (this.pet_med_hist != null) {
      //   this.pet_med_hist = this.pet_med_hist.replace(/"/g, "");
      //   this.pet_med_hist = this.pet_med_hist.replace(/\n/g, " ");
      //   var med_hist = '"' + this.pet_med_hist + '"';
      // } else {
      //   med_hist = null;
      // }

      // if (this.pet_special_req != null) {
      //   this.pet_special_req = this.pet_special_req.replace(/"/g, "");
      //   this.pet_special_req = this.pet_special_req.replace(/\n/g, " ");
      //   var special_req = '"' + this.pet_special_req + '"';
      // } else {
      //   special_req = null;
      // }
      // const dataToSend =
      //   '{"pet_owner_name":"' +
      //   this.pet_owner_name +
      //   '", "pet_name":"' +
      //   this.pet_name +
      //   '", "med_hist":' +
      //   med_hist +
      //   ', "special_req":' +
      //   special_req +
      //   "}";
      // console.log(dataToSend);
      // const jsonDataToSend = JSON.parse(dataToSend);
      // console.log(jsonDataToSend);
      // window.location.href = constants.pet_owner_view_pet_info;
    },
    fetchData: async function() {},
  },
  async mounted() {
    this.username = document.cookie.split("=")[1];
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.caretaker = urlParams.get("caretaker");

    this.pet_arr = [{name: "AnimalA"}, {name: "AnimalB"}, {name: "AnimalC"}];
    //const response = await axios.get("/pet-owners/view-caretakers-profiles");
    //number_of_pets = response.data.belongstotabledata[0].data_set;
    //for(var i = 1; i <= number_of_pets; i++){
    //
    //}
    //pet_name_arr
  },
};
</script>
// PETS (pet_arr): Pets that can be select are those that belongs to the user
// PRICE_RATE: When pet is selected, it should cross with caretaker current price rate to have and then show price rate
// AVAILABILTIES & NUM OF PETS AT THAT SLOT: Caretaking dates that can be selected are drom the caretaker's avalilties (parttime) or not leave days (fulltime)
// and that the number of slots does not exceed
// Ensure that the DATETIME of the end is after the start! (aka on same day, must impose the condition on time!)
// NUM_PET_DAYS: Caculate when the dates are selected
// PRICE: price_rate * availabilities --> Enable payment methods
// Payment button only enabled with price
// Decide - What to do after the pay by cash/ pay by credit card button is pressed??
