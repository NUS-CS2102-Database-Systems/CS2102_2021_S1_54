<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded && have_data">
        <v-col class="mx-auto">
          <v-list v-for="(number, i) in id_odd" :key="number">
            <v-row>
              <v-card width="45%">
                <v-card-title> Job {{ number }} </v-card-title>
                <p>
                  Caretaker Username: {{ caretaker_odd[i] }} <br />
                  Pet Name: {{ pet_odd[i] }} <br />
                  Job Started: {{ job_start_odd[i] }} <br />
                  Job Ended: {{ job_end_odd[i] }} <br />
                  Transfer Method (Pick Up): {{ start_transfer_method_odd[i] }}
                  <br />
                  Transfer Method (Drop Off): {{ end_transfer_method_odd[i] }}
                  <br />
                  Amount: {{ amount_odd[i] }} <br />
                  Rating: {{ rating_odd[i] }} <br />
                  Review: {{ review_even[i] }} <br />
                </p>
              </v-card>
            </v-row>
          </v-list>
        </v-col>
        <v-spacer />
        <v-col class="mx-auto">
          <v-list v-for="(number, i) in id_even" :key="number">
            <v-row>
              <v-card width="45%">
                <v-card-title> Job {{ number }} </v-card-title>
                <p>
                  Caretaker Username: {{ caretaker_even[i] }} <br />
                  Pet Name: {{ pet_even[i] }} <br />
                  Job Started: {{ job_start_even[i] }} <br />
                  Job Ended: {{ job_end_even[i] }} <br />
                  Transfer Method (Pick Up): {{ start_transfer_method_even[i] }}
                  <br />
                  Transfer Method (Drop Off): {{ end_transfer_method_even[i] }}
                  <br />
                  Amount: {{ amount_even[i] }} <br />
                  Rating: {{ rating_even[i] }} <br />
                  Review: {{ review_even[i] }} <br />
                </p>
              </v-card>
            </v-row>
          </v-list>
        </v-col>
      </template>
      <template v-else-if="loaded && !have_data">
        <v-row>
          <v-card
            class="mx-auto"
            width="60%"
            height="160"
            color="#ECEFF1"
            rounded
          >
            <v-card-title>
              <v-row align="center" justify="center">
                <v-icon light large center>mdi-emoticon-sad</v-icon>
              </v-row>
            </v-card-title>
            <p class="text-center">
              You have no pets under our care at the moment.
              <br />We hope to meet them soon! :)
            </p>
          </v-card>
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
import PetOwnerNavBar from "./PetOwnerNavBar";

export default {
  name: "PetOwnerViewOngoingJobs",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: true,
    have_data: false,
    id_odd: [],
    id_even: [],
    caretaker_odd: [],
    caretaker_even: [],
    pet_odd: [],
    pet_even: [],
    job_start_odd: [],
    job_start_even: [],
    job_end_odd: [],
    job_end_even: [],
    amount_odd: [],
    amount_even: [],
    start_transfer_method_odd: [],
    start_transfer_method_even: [],
    end_transfer_method_odd: [],
    end_transfer_method_even: [],
    rating_odd: [],
    rating_even: [],
    review_odd: [],
    review_even: [],
  }),
  methods: {
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
  async mounted() {},
};
</script>
