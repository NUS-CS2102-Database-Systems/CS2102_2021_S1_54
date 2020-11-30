<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PartTimeCaretakerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded">
        <h2>Welcome to Petopia, {{ username }}!</h2>
        <br />
        <v-card width="70%">
          <v-card-title style="font-weight:bold;">
            For {{ month }} {{ year }} so far, you have:
          </v-card-title>
          <v-layout align-center>
            <v-card-text>
              <p style="color:black;font-size:20px">
                Taken care of <b>{{ num_pets }}</b> pets in
                <b>{{ num_pet_days }}</b> pet-days. <br />
                Earned <b>SGD {{ amount_earned }}</b
                >. <br />
              </p>
            </v-card-text>
          </v-layout>
        </v-card>

        <br />
        <br />
        <br />
        <h3>Current Event</h3>
        <br />
        <v-data-table	v-if="current_event.length!=0"
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
        <v-data-table	v-if="upcoming_event.length!=0"
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
import PartTimeCaretakerNavBar from "./PartTimeCaretakerNavBar";
import axios from "axios";

export default {
  name: "PartTimeCaretakerHome",

  components: {
    PartTimeCaretakerNavBar,
  },
  data: () => ({
    loaded: false, //true,
    username: null,
    month: null,
    year: null,
    num_pets: 0,
    amount_earned: 0,
    num_pet_days: 0,

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

    current_event: [],
    upcoming_event: [],
  }),
  async mounted() {
    this.username = document.cookie.split("=")[1];
    let date = new Date();
    this.month = date.toString().split(" ")[1];
    this.year = date.getFullYear();

    // Get current date with time = 00:00:00
    let today = new Date();
    let myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    let myTomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1, 0, 0, 0);
    let myToday_str = myToday.toISOString().toString();
    myToday_str = myToday_str.replace(/T/, " ");
    myToday_str = myToday_str.substring(0, myToday_str.length - 1);

    let myTomorrow_str = myTomorrow.toISOString().toString();
    myTomorrow_str = myTomorrow_str.replace(/T/, " ");
    myTomorrow_str = myTomorrow_str.substring(0, myToday_str.length - 1);

    let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
    //let firstDayOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0);

    const get_info = {
      username: this.username,
      current_datetime: myToday_str,
      tomorrow_datetime: myTomorrow_str,
      startMonth: firstDayOfMonth,
      //endMonth: firstDayOfNextMonth,
    };

    await axios
      .post(
        "https://pet-care-service.herokuapp.com/caretakers/get-num-bid-transactions",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        if (response.data.length == 0) {
          this.num_pets = 0;
        } else if (response.data[0].num_pets == undefined) {
          this.num_pets = 0;
        } else {
          this.num_pets = response.data[0].num_pets;
        }
      });

    await axios
      .post(
        "https://pet-care-service.herokuapp.com/caretakers/get-num-pet-days",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        if (response.data.length == 0) {
          this.num_pet_days = 0;
        } else {
          this.num_pet_days = response.data[0].pet_days;
        }
      });

    await axios
      .post(
        "https://pet-care-service.herokuapp.com/part-time-caretakers/get-salary",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        if (response.data.length == 0) {
          this.amount_earned = 0;
        } else {
          this.amount_earned = response.data[0].salary;
        }
      });

    await axios
      .post(
        "https://pet-care-service.herokuapp.com/caretakers/home-current-event",
        {
          toGet: get_info
        }
      )
      .then((response) => {
        var i
        for (i = 0; i < response.data.length; i++) { 
          let comment_arr_temp = []

          let job_start_date = new Date(response.data[i].job_start_datetime.toString().split("T")[0]);
          console.log(job_start_date)
          if (job_start_date >= myToday && job_start_date < myTomorrow){
            if (response.data[i].payment_method.toString() == "Cash"){
              comment_arr_temp.push("Collect $" + response.data[i].amount.toString())
            }
            comment_arr_temp.push("Start day")
          }

          let job_end_date = new Date(response.data[i].job_end_datetime.toString().split("T")[0]);
          console.log(job_end_date)
          if (job_end_date >= myToday && job_end_date < myTomorrow){
            comment_arr_temp.push("End day")
          }

          let event_data = {
            pet_name: response.data[i].pet_name,
            cusername: response.data[i].pusername, 
            job_start_datetime: response.data[i].job_start_datetime,
            job_end_datetime: response.data[i].job_end_datetime,
            comment_arr: comment_arr_temp, 
            start_transfer_method: response.data[i].start_transfer_method, 
            end_transfer_method: response.data[i].end_transfer_method, 
          };
          this.current_event.push(event_data);
        }
      });
    await axios
      .post(
        "https://pet-care-service.herokuapp.com/caretakers/home-upcoming-event",
        {
          toGet: get_info
        }
      )
      .then((response) => {
        var i
        for (i = 0; i < response.data.length; i++) { 

          let event_data = {
            pet_name: response.data[i].pet_name,
            cusername: response.data[i].pusername, 
            job_start_datetime: response.data[i].job_start_datetime.toString().replace(/T/, " at ").substring(0, myToday_str.length - 4),
            job_end_datetime: response.data[i].job_end_datetime.toString().replace(/T/, " at ").substring(0, myToday_str.length - 4),
            start_transfer_method: response.data[i].start_transfer_method,
            end_transfer_method: response.data[i].end_transfer_method, 
          };
          this.upcoming_event.push(event_data);
        }
      });

    this.loaded = true;
  },
};
</script>
