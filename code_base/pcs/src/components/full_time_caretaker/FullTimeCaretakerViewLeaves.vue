<template>
  <v-container>
    <div style="width: 20%; float: left">
      <FullTimeCaretakerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <h1>Viewing My Leaves</h1>
      <v-btn icon color="blue" fab @click="applyForLeave">
        <v-icon>mdi-pencil</v-icon>
        Apply For Leave
      </v-btn>
      <template v-if="loaded && have_data">
        <br />
        <v-layout justify-left>
        </v-layout>
        <v-row>
          <v-col class="mx-auto">
            <v-list v-for="(number, i) in id_odd" :key="number">
              <v-row>
                <v-card width="55%">
                  <v-card-title> Leave {{ number }} </v-card-title>
                  <v-card-text>
                    <p style="color:black">
                      Reason: {{ reason_odd[i] }} <br />
                      Start Date: {{ start_date_odd[i] }} <br />
                      End Date: {{ end_date_odd[i] }} <br />
                    </p>
                  </v-card-text>
                  <v-btn elevation="2" @click="deleteLeave(start_date_odd[i], end_date_odd[i])">
                      Delete Leave
                  </v-btn>
                </v-card>
              </v-row>
            </v-list>
          </v-col>
          <v-col class="mx-auto">
            <v-list v-for="(number, i) in id_even" :key="number">
              <v-row>
                <v-card width="55%">
                  <v-card-title> Leave {{ number }} </v-card-title>
                  <v-card-text>
                    <p style="color:black">
                      Reason: {{ reason_even[i] }} <br />
                      Start Date: {{ start_date_even[i] }} <br />
                      End Date: {{ end_date_even[i] }} <br />
                    </p>
                  </v-card-text>
                  <v-btn elevation="2" @click="deleteLeave(start_date_even[i], end_date_even[i])">
                      Delete Leave
                  </v-btn>
                </v-card>
              </v-row>
            </v-list>
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
import FullTimeCaretakerNavBar from "./FullTimeCaretakerNavBar";
import * as constants from "../constants";
import axios from "axios";
import Swal from 'sweetalert2';

export default {
  name: "FullTimeCaretakerViewLeaves",
  components: {
    FullTimeCaretakerNavBar,
  },
  data: () => ({
    have_data: false,
    loaded: false,
    id_odd: [],
    id_even: [],
    reason_odd: [],
    reason_even: [],
    start_date_odd: [],
    start_date_even: [],
    end_date_odd: [],
    end_date_even: [],
  }),
  methods: {
    applyForLeave: function() {
      window.location.href =
        constants.full_time_caretaker_apply_for_leave + document.cookie;
    },

    deleteLeave: async function(start, end) {
      const username = document.cookie.split("=")[1];

      const response = await axios({
        method: 'delete',
        url: 'https://pet-care-service.herokuapp.com/apply-leave',
        data: {
          username: username,
          start_date: start,
          end_date: end,
        }
      });

      if (response.data.rowCount === 1) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Leave deleted successfully."
        })
        window.location.reload(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong. Please try again later."
        });
      }
    }
  },

  async mounted() {
    const username = document.cookie.split("=")[1];

    await axios
      .get(
        `https://pet-care-service.herokuapp.com/apply-leave?username=${username}`
      )
      .then((response) => {
        let length = response.data.length;
        if (length == 0) {
          this.have_data = false;
        } else {
          this.have_data = true;
          for (let i = 0; i < length; i++) {
            if (i % 2 == 0) {
              this.id_odd.push(i + 1);
              this.reason_odd.push(response.data[i].reason_for_leave);
              let start_date = response.data[i].start_date.split("T")[0];
              this.start_date_odd.push(start_date);
              let end_date = response.data[i].end_date.split("T")[0];
              this.end_date_odd.push(end_date);
            } else {
              this.id_even.push(i + 1);
              this.reason_even.push(response.data[i].reason_for_leave);
              let start_date = response.data[i].start_date.split("T")[0];
              this.start_date_even.push(start_date);
              let end_date = response.data[i].end_date.split("T")[0];
              this.end_date_even.push(end_date);
            }
          }
        }
      });
    this.loaded = true;
  },
};
</script>
