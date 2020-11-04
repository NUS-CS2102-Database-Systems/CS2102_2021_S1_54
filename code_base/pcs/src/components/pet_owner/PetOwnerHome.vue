<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h2>Welcome to Petopia, {{ username }}!</h2>
        <br />
        <h3>Current Event</h3>
        <br />
        <v-data-table	v-if="current_event!=null"
          :headers="headers_current"	
          :items="current_event"	
          :sort-by="['comment_arr', 'job_end_datetime']"
          :sort-desc="[true, false]"
          multi-sort
          hide-default-footer	
          class="elevation-1"	
        ></v-data-table>
        <p v-else>No pet is in caretaking today</p>
        <br />
        
        <br />
        <h3>Upcoming Events</h3>
        <br />
        <v-data-table	v-if="upcoming_event!=null"
          :headers="headers_upcoming"	
          :items="upcoming_event"	
          :sort-by="['job_start_datetime', 'start_transfer_method']"
          :sort-desc="[false, false]"
          multi-sort
          hide-default-footer	
          class="elevation-1"	
        ></v-data-table>
        <p v-else>No upcoming pet care event</p>
        <br />

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

export default {
  name: "PetOwnerHome",
  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: true,
    username: null,

    headers_current: [
      {
        text: 'Animal',
        align: 'start',
        value: 'pet_name',
      },
      { text: 'Caretaker', value: 'cusername' },
      { text: 'Start Date and Time', value: 'job_start_datetime' },
      { text: 'Start Transfer Mtd', value: 'start_transfer_method' },
      { text: 'End Date and Time', value: 'job_end_datetime' },
      { text: 'End Transfer Mtd', value: 'end_transfer_method' },
      { text: 'Note', value: 'comment_arr' },
    ],
    
    headers_upcoming: [
      {
        text: 'Animal',
        align: 'start',
        value: 'pet_name',
      },
      { text: 'Caretaker', value: 'cusername' },
      { text: 'Start Date and Time', value: 'job_start_datetime' },
      { text: 'Start Transfer Mtd', value: 'start_transfer_method' },
      { text: 'End Date and Time', value: 'job_end_datetime' },
      { text: 'End Transfer Mtd', value: 'end_transfer_method' },
    ],

    current_event: null,
    upcoming_event: null,
  }),
  async mounted() {
    this.username = document.cookie.split("=")[1];

    //Get this kind of data for current event!!
    this.current_event = [ 
      {
        // pusername:,
        pet_name: "AnimalA",
        cusername: "Alice", //Caretaker
        job_start_datetime: "Oct 02 2020 07:00",
        job_end_datetime: "Oct 02 2020 20:00",
        // start_date: "2020-10-2",
        // end_date: "2020-10-2",
        // start_time: "07:00",
        // end_time: "20:00",
        comment_arr: ["Start day", "End day"],
        start_transfer_method: "Pet Owner Deliver", //{mtd: "Pet Owner Deliver"}, {mtd: "Care Taker Pickup"}, {mtd: "Transfer thorugh PCS Building"}
        end_transfer_method: "Pet Owner Pickup", //{mtd: "Pet Owner Pickup"}, {mtd: "Care Taker Deliver"}, {mtd: "Transfer thorugh PCS Building"}
      },
      {
        // pusername:,
        pet_name: "AnimalB",
        cusername: "Ben", //Caretaker
        job_start_datetime: "Oct 02 2020 07:00",
        job_end_datetime: "Oct 04 2020 20:00",
        // start_date: "2020-10-2",
        // end_date: "2020-10-4",
        // start_time: "07:00",
        // end_time: "20:00",
        comment_arr: [],
        start_transfer_method: "Care Taker Pickup", //{mtd: "Pet Owner Deliver"}, {mtd: "Care Taker Pickup"}, {mtd: "Transfer thorugh PCS Building"}
        end_transfer_method: "Care Taker Deliver", //{mtd: "Pet Owner Pickup"}, {mtd: "Care Taker Deliver"}, {mtd: "Transfer thorugh PCS Building"}
      },
      {
        // pusername:,
        pet_name: "AnimalC",
        cusername: "Can", //Caretaker
        job_start_datetime: "Oct 01 2020 07:00",
        job_end_datetime: "Oct 02 2020 20:00",
        // start_date: "2020-10-1",
        // end_date: "2020-10-2",
        // start_time: "07:00",
        // end_time: "20:00",
        comment_arr: ["End day"],
        start_transfer_method: "Transfer thorugh PCS Building", //{mtd: "Pet Owner Deliver"}, {mtd: "Care Taker Pickup"}, {mtd: "Transfer thorugh PCS Building"}
        end_transfer_method: "Transfer thorugh PCS Building", //{mtd: "Pet Owner Pickup"}, {mtd: "Care Taker Deliver"}, {mtd: "Transfer thorugh PCS Building"}
      },
    ];

    this.upcoming_event = [ 
      {
        // pusername:,
        pet_name: "AnimalD",
        cusername: "Dan", //Caretaker
        job_start_datetime: "Oct 06 2020 07:00",
        job_end_datetime: "Oct 08 2020 20:00",
        // start_date: "2020-10-2",
        // end_date: "2020-10-2",
        // start_time: "07:00",
        // end_time: "20:00",
        comment_arr: ["Start day", "End day"],
        start_transfer_method: "Pet Owner Deliver", //{mtd: "Pet Owner Deliver"}, {mtd: "Care Taker Pickup"}, {mtd: "Transfer thorugh PCS Building"}
        end_transfer_method: "Pet Owner Pickup", //{mtd: "Pet Owner Pickup"}, {mtd: "Care Taker Deliver"}, {mtd: "Transfer thorugh PCS Building"}
      },
      {
        // pusername:,
        pet_name: "AnimalE",
        cusername: "Elaine", //Caretaker
        job_start_datetime: "Oct 12 2020 07:00",
        job_end_datetime: "Oct 15 2020 20:00",
        // start_date: "2020-10-2",
        // end_date: "2020-10-4",
        // start_time: "07:00",
        // end_time: "20:00",
        comment_arr: ["Start day"],
        start_transfer_method: "Care Taker Pickup", //{mtd: "Pet Owner Deliver"}, {mtd: "Care Taker Pickup"}, {mtd: "Transfer thorugh PCS Building"}
        end_transfer_method: "Care Taker Deliver", //{mtd: "Pet Owner Pickup"}, {mtd: "Care Taker Deliver"}, {mtd: "Transfer thorugh PCS Building"}
      },
      {
        // pusername:,
        pet_name: "AnimalF",
        cusername: "Fanny", //Caretaker
        job_start_datetime: "Oct 10 2020 07:00",
        job_end_datetime: "Oct 16 2020 20:00",
        // start_date: "2020-10-1",
        // end_date: "2020-10-2",
        // start_time: "07:00",
        // end_time: "20:00",
        comment_arr: ["End day"],
        start_transfer_method: "Transfer thorugh PCS Building", //{mtd: "Pet Owner Deliver"}, {mtd: "Care Taker Pickup"}, {mtd: "Transfer thorugh PCS Building"}
        end_transfer_method: "Transfer thorugh PCS Building", //{mtd: "Pet Owner Pickup"}, {mtd: "Care Taker Deliver"}, {mtd: "Transfer thorugh PCS Building"}
      },
    ];
  },
};
</script>
