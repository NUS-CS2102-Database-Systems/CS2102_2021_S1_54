<template>
  <v-container>
    <div style="width: 20%; float: left">
      <FullTimeCaretakerNavBar />
    </div>
    <div style="width: 80%; float: right">
        <h1> Viewing My Leaves </h1>
      <template v-if="loaded && have_data">
        <br />
        <v-col class="mx-auto">
          <v-list v-for="(number, i) in id_odd" :key="number">
            <v-row>
              <v-card width="45%">
                <v-card-title> Leave {{ number }} </v-card-title>
                <v-card-text>
                  Reason: {{ reason_odd[i] }} <br />
                  Start Date: {{ start_date_odd[i] }} <br />
                  End Date: {{ end_date_odd[i] }} <br />
                </v-card-text>
              </v-card>
            </v-row>
          </v-list>
        </v-col>
        <v-spacer />
        <v-col class="mx-auto">
          <v-list v-for="(number, i) in id_even" :key="number">
            <v-row>
              <v-card width="45%">
                <v-card-title> Leave {{ number }} </v-card-title>
                <v-card-text>
                  Reason: {{ reason_even[i] }} <br />
                  Start Date: {{ start_date_even[i] }} <br />
                  End Date: {{ end_date_even[i] }} <br />
                </v-card-text>
              </v-card>
            </v-row>
          </v-list>
        </v-col>
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
import axios from "axios";

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
  async mounted() {
    
    const username = document.cookie.split("=")[1];

    await axios
      .get(`https://pet-care-service.herokuapp.com/apply-leave?username=${username}`)
      .then((response) => {
        let length = response.data.length;
        if (length == 0) {
          this.have_data = false;
        } else {
          this.have_data = true;
          for (let i = 0; i < length; i++) {
            if (i % 2 == 0) {
              this.id_odd.push(i + 1);
              this.reason_odd.push(response.data[i].reason_for_leave)
              this.start_date_odd.push(response.data[i].start_date);
              this.end_date_odd.push(response.data[i].end_date);
            } else {
              this.id_even.push(i + 1);
              this.reason_even.push(response.data[i].reason_for_leave);
              this.start_date_even.push(response.data[i].start_date);
              this.end_date_even.push(response.data[i].end_date);
            }
          }
        }
      });
    this.loaded = true;
    },
};
</script>
