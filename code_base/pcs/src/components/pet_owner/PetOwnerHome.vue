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
        <v-data-table
          v-if="current_event.length != 0"
          :headers="headers_current"
          :items="current_event"
          :sort-by="['comment_arr', 'job_end_datetime']"
          :sort-desc="[true, false]"
          multi-sort
          hide-default-footer
          class="elevation-1"
        ></v-data-table>
        <p v-else>You do not have any pets with us today.</p>
        <br />

        <br />
        <h3>Upcoming Events</h3>
        <br />
        <v-data-table
          v-if="upcoming_event.length != 0"
          :headers="headers_upcoming"
          :items="upcoming_event"
          :sort-by="['job_start_datetime', 'start_transfer_method']"
          :sort-desc="[false, false]"
          multi-sort
          hide-default-footer
          class="elevation-1"
        ></v-data-table>
        <p v-else>You do not have any plans with us in the future yet.</p>
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
import axios from "axios";

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
        text: "Animal",
        align: "start",
        value: "pet_name",
      },
      { text: "Caretaker", value: "cusername" },
      { text: "Start Date and Time", value: "job_start_datetime" },
      { text: "Start Transfer Mtd", value: "start_transfer_method" },
      { text: "End Date and Time", value: "job_end_datetime" },
      { text: "End Transfer Mtd", value: "end_transfer_method" },
      { text: "Note", value: "comment_arr" },
    ],

    headers_upcoming: [
      {
        text: "Animal",
        align: "start",
        value: "pet_name",
      },
      { text: "Caretaker", value: "cusername" },
      { text: "Start Date and Time", value: "job_start_datetime" },
      { text: "Start Transfer Mtd", value: "start_transfer_method" },
      { text: "End Date and Time", value: "job_end_datetime" },
      { text: "End Transfer Mtd", value: "end_transfer_method" },
    ],

    current_event: [],
    upcoming_event: [],
  }),
  async mounted() {
    this.loaded = false;
    this.username = document.cookie.split("=")[1];

    // Get current date with time = 00:00:00
    let today = new Date();
    //today.setHours(today.getHours() + 8);
    let myToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0
    );
    let myTomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      0
    );
    // let date = new Date();
    // let hours = date.setHours(date.getHours() + 8);
    let myToday_str = myToday.toISOString().toString();
    myToday_str = myToday_str.replace(/T/, " ");
    myToday_str = myToday_str.substring(0, myToday_str.length - 1);

    let myTomorrow_str = myTomorrow.toISOString().toString();
    myTomorrow_str = myTomorrow_str.replace(/T/, " ");
    myTomorrow_str = myTomorrow_str.substring(0, myToday_str.length - 1);
    //console.log(today)
    //console.log(myToday)
    //console.log(myTomorrow)

    const get_info = {
      username: this.username,
      current_datetime: myToday_str,
      tomorrow_datetime: myTomorrow_str,
    };

    await axios
      .post(
        "https://pet-care-service.herokuapp.com/pet-owners/home-current-event",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        //console.log("In response of current")
        var i;
        for (i = 0; i < response.data.length; i++) {
          let comment_arr_temp = [];

          //let date_string = response.data[i].job_start_datetime.toString().split("T")[0];
          //let job_start_date = new Date(date_string);
          //console.log(response.data[i].job_start_datetime)
          let job_start_date = new Date(
            response.data[i].job_start_datetime.toString().split("T")[0]
          );
          console.log(job_start_date);
          if (job_start_date >= myToday && job_start_date < myTomorrow) {
            if (response.data[i].payment_method.toString() == "Cash") {
              comment_arr_temp.push(
                "Cash Payment of $" + response.data[i].amount.toString()
              );
            }
            comment_arr_temp.push("Start day");
          }

          let job_end_date = new Date(
            response.data[i].job_end_datetime.toString().split("T")[0]
          );
          console.log(job_end_date);
          if (job_end_date >= myToday && job_end_date < myTomorrow) {
            comment_arr_temp.push("End day");
          }

          let event_data = {
            pet_name: response.data[i].pet_name,
            cusername: response.data[i].cusername, //Caretaker
            job_start_datetime: response.data[i].job_start_datetime,
            job_end_datetime: response.data[i].job_end_datetime,
            comment_arr: comment_arr_temp, //["Start day", "End day"],
            start_transfer_method: response.data[i].start_transfer_method, //{mtd: "Pet Owner Deliver"}, {mtd: "Care Taker Pickup"}, {mtd: "Transfer thorugh PCS Building"}
            end_transfer_method: response.data[i].end_transfer_method, //{mtd: "Pet Owner Pickup"}, {mtd: "Care Taker Deliver"}, {mtd: "Transfer thorugh PCS Building"}
          };
          this.current_event.push(event_data);
        }
      });
    await axios
      .post(
        "https://pet-care-service.herokuapp.com/pet-owners/home-upcoming-event",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        var i;
        for (i = 0; i < response.data.length; i++) {
          // let comment_arr_temp = []
          // console.log(myToday)
          // console.log(myTomorrow)
          // let job_start_date = new Date(response.data[i].job_start_datetime.toString().split("T")[0]);
          // console.log(job_start_date)
          // if (job_start_date >= myToday && job_start_date < myTomorrow){
          //   comment_arr_temp.push("Start day")
          // }
          // let job_end_date = new Date(response.data[i].job_end_datetime.toString().split("T")[0]);
          // console.log(job_end_date)
          // if (job_end_date >= myToday && job_end_date < myTomorrow){
          //   comment_arr_temp.push("End day")
          // }
          // console.log(comment_arr_temp)

          let event_data = {
            pet_name: response.data[i].pet_name,
            cusername: response.data[i].cusername, //Caretaker
            job_start_datetime: response.data[i].job_start_datetime
              .toString()
              .replace(/T/, " at ")
              .substring(0, myToday_str.length - 4),
            job_end_datetime: response.data[i].job_end_datetime
              .toString()
              .replace(/T/, " at ")
              .substring(0, myToday_str.length - 4),
            //comment_arr: [], //["Start day", "End day"],
            start_transfer_method: response.data[i].start_transfer_method, //{mtd: "Pet Owner Deliver"}, {mtd: "Care Taker Pickup"}, {mtd: "Transfer thorugh PCS Building"}
            end_transfer_method: response.data[i].end_transfer_method, //{mtd: "Pet Owner Pickup"}, {mtd: "Care Taker Deliver"}, {mtd: "Transfer thorugh PCS Building"}
          };
          this.upcoming_event.push(event_data);
        }
      });
    this.loaded = true;

    // //Get this kind of data for current event!!
    // this.current_event = [
    //   {
    //     // pusername:,
    //     pet_name: "AnimalA",
    //     cusername: "Alice", //Caretaker
    //     job_start_datetime: "Oct 02 2020 07:00",
    //     job_end_datetime: "Oct 02 2020 20:00",
    //     // start_date: "2020-10-2",
    //     // end_date: "2020-10-2",
    //     // start_time: "07:00",
    //     // end_time: "20:00",
    //     comment_arr: ["Start day", "End day"],
    //     start_transfer_method: "Pet Owner Deliver", //{mtd: "Pet Owner Deliver"}, {mtd: "Care Taker Pickup"}, {mtd: "Transfer thorugh PCS Building"}
    //     end_transfer_method: "Pet Owner Pickup", //{mtd: "Pet Owner Pickup"}, {mtd: "Care Taker Deliver"}, {mtd: "Transfer thorugh PCS Building"}
    //   },
    //   {
    //     // pusername:,
    //     pet_name: "AnimalB",
    //     cusername: "Ben", //Caretaker
    //     job_start_datetime: "Oct 02 2020 07:00",
    //     job_end_datetime: "Oct 04 2020 20:00",
    //     // start_date: "2020-10-2",
    //     // end_date: "2020-10-4",
    //     // start_time: "07:00",
    //     // end_time: "20:00",
    //     comment_arr: [],
    //     start_transfer_method: "Care Taker Pickup", //{mtd: "Pet Owner Deliver"}, {mtd: "Care Taker Pickup"}, {mtd: "Transfer thorugh PCS Building"}
    //     end_transfer_method: "Care Taker Deliver", //{mtd: "Pet Owner Pickup"}, {mtd: "Care Taker Deliver"}, {mtd: "Transfer thorugh PCS Building"}
    //   },
    //   {
    //     // pusername:,
    //     pet_name: "AnimalC",
    //     cusername: "Can", //Caretaker
    //     job_start_datetime: "Oct 01 2020 07:00",
    //     job_end_datetime: "Oct 02 2020 20:00",
    //     // start_date: "2020-10-1",
    //     // end_date: "2020-10-2",
    //     // start_time: "07:00",
    //     // end_time: "20:00",
    //     comment_arr: ["End day"],
    //     start_transfer_method: "Transfer thorugh PCS Building", //{mtd: "Pet Owner Deliver"}, {mtd: "Care Taker Pickup"}, {mtd: "Transfer thorugh PCS Building"}
    //     end_transfer_method: "Transfer thorugh PCS Building", //{mtd: "Pet Owner Pickup"}, {mtd: "Care Taker Deliver"}, {mtd: "Transfer thorugh PCS Building"}
    //   },
    // ];

    // this.upcoming_event = [
    //   {
    //     // pusername:,
    //     pet_name: "AnimalD",
    //     cusername: "Dan", //Caretaker
    //     job_start_datetime: "Oct 06 2020 07:00",
    //     job_end_datetime: "Oct 08 2020 20:00",
    //     // start_date: "2020-10-2",
    //     // end_date: "2020-10-2",
    //     // start_time: "07:00",
    //     // end_time: "20:00",
    //     comment_arr: ["Start day", "End day"],
    //     start_transfer_method: "Pet Owner Deliver", //{mtd: "Pet Owner Deliver"}, {mtd: "Care Taker Pickup"}, {mtd: "Transfer thorugh PCS Building"}
    //     end_transfer_method: "Pet Owner Pickup", //{mtd: "Pet Owner Pickup"}, {mtd: "Care Taker Deliver"}, {mtd: "Transfer thorugh PCS Building"}
    //   },
    //   {
    //     // pusername:,
    //     pet_name: "AnimalE",
    //     cusername: "Elaine", //Caretaker
    //     job_start_datetime: "Oct 12 2020 07:00",
    //     job_end_datetime: "Oct 15 2020 20:00",
    //     // start_date: "2020-10-2",
    //     // end_date: "2020-10-4",
    //     // start_time: "07:00",
    //     // end_time: "20:00",
    //     comment_arr: ["Start day"],
    //     start_transfer_method: "Care Taker Pickup", //{mtd: "Pet Owner Deliver"}, {mtd: "Care Taker Pickup"}, {mtd: "Transfer thorugh PCS Building"}
    //     end_transfer_method: "Care Taker Deliver", //{mtd: "Pet Owner Pickup"}, {mtd: "Care Taker Deliver"}, {mtd: "Transfer thorugh PCS Building"}
    //   },
    //   {
    //     // pusername:,
    //     pet_name: "AnimalF",
    //     cusername: "Fanny", //Caretaker
    //     job_start_datetime: "Oct 10 2020 07:00",
    //     job_end_datetime: "Oct 16 2020 20:00",
    //     // start_date: "2020-10-1",
    //     // end_date: "2020-10-2",
    //     // start_time: "07:00",
    //     // end_time: "20:00",
    //     comment_arr: ["End day"],
    //     start_transfer_method: "Transfer thorugh PCS Building", //{mtd: "Pet Owner Deliver"}, {mtd: "Care Taker Pickup"}, {mtd: "Transfer thorugh PCS Building"}
    //     end_transfer_method: "Transfer thorugh PCS Building", //{mtd: "Pet Owner Pickup"}, {mtd: "Care Taker Deliver"}, {mtd: "Transfer thorugh PCS Building"}
    //   },
    // ];
  },
};
</script>
