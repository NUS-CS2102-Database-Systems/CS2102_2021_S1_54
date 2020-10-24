<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PartTimeCaretakerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded && have_data">
        <h2>Hello {{ username }}!</h2>
        <br />
        <h2>Here are the jobs in progress:</h2>
        <br />
        <v-col class="mx-auto">
          <v-list v-for="(number, i) in id_odd" :key="number">
            <v-row>
              <v-card width="45%">
                <v-card-title> Job {{ number }} </v-card-title>
                <v-card-text>
                  <h3>Job Information</h3>
                  Pet Owner Username: {{ pet_owner_odd[i] }} <br />
                  Pet Name: {{ pet_odd[i] }} <br />
                  Job Started: {{ job_start_odd[i] }} <br />
                  Job Ended: {{ job_end_odd[i] }} <br />
                  Transfer Method (Pick Up): {{ start_transfer_method_odd[i] }}
                  <br />
                  Transfer Method (Drop Off): {{ end_transfer_method_odd[i] }}
                  <br />
                  Amount: {{ amount_odd[i] }} <br />
                  Rating: {{ rating_odd[i] }} <br />
                  Review: {{ review_odd[i] }} <br />

                  <h3>Pet Owner Information</h3>
                  Name: {{ pet_owner_name_odd[i] }} <br />
                  Gender: {{ pet_owner_gender_odd[i] }} <br />
                  Phone: {{ pet_owner_phone_odd[i] }}
                  <br />
                  Email: {{ pet_owner_email_odd[i] }} <br />
                  Address: {{ pet_owner_address_odd[i] }} <br />

                  <h3>Pet Information</h3>
                  Age: {{ pet_age_odd[i] }} <br />
                  Gender: {{ pet_gender_odd[i] }} <br />
                  Breed: {{ pet_breed_odd[i] }} <br />
                  Type of Animal: {{ type_of_animal_odd[i] }}
                  <br />
                  Medical History: {{ pet_med_hist_odd[i] }}
                  <br />
                  Special Requirements: {{ pet_special_req_odd[i] }} <br />
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
                <v-card-title> Job {{ number }} </v-card-title>
                <v-card-text>
                  <h3>Job Information</h3>
                  Pet Owner Username: {{ pet_owner_even[i] }} <br />
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

                  <h3>Pet Owner Information</h3>
                  Name: {{ pet_owner_name_even[i] }} <br />
                  Gender: {{ pet_owner_gender_even[i] }} <br />
                  Phone: {{ pet_owner_phone_even[i] }}
                  <br />
                  Email: {{ pet_owner_email_even[i] }} <br />
                  Address: {{ pet_owner_address_even[i] }} <br />

                  <h3>Pet Information</h3>
                  Age: {{ pet_age_even[i] }} <br />
                  Gender: {{ pet_gender_even[i] }} <br />
                  Breed: {{ pet_breed_even[i] }} <br />
                  Type of Animal: {{ type_of_animal_even[i] }}
                  <br />
                  Medical History: {{ pet_med_hist_even[i] }}
                  <br />
                  Special Requirements: {{ pet_special_req_even[i] }} <br />
                </v-card-text>
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
              Hi {{ username }}. You have no pets under your care at the moment.
              <br />
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
import PartTimeCaretakerNavBar from "./PartTimeCaretakerNavBar";

export default {
  name: "PartTimeCaretakerViewOngoingJobs",

  components: {
    PartTimeCaretakerNavBar,
  },
  data: () => ({
    loaded: true,
    have_data: false,
    username: null,
    id_odd: [],
    id_even: [],
    pet_owner_odd: [],
    pet_owner_even: [],
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
    pet_owner_name_odd: [],
    pet_owner_gender_odd: [],
    pet_owner_phone_odd: [],
    pet_owner_email_odd: [],
    pet_owner_address_odd: [],
    pet_age_odd: [],
    pet_gender_odd: [],
    pet_breed_odd: [],
    type_of_animal_odd: [],
    pet_med_hist_odd: [],
    pet_special_req_odd: [],
    pet_owner_name_even: [],
    pet_owner_gender_even: [],
    pet_owner_phone_even: [],
    pet_owner_email_even: [],
    pet_owner_address_even: [],
    pet_age_even: [],
    pet_gender_even: [],
    pet_breed_even: [],
    type_of_animal_even: [],
    pet_med_hist_even: [],
    pet_special_req_even: [],
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
  async mounted() {
    this.username = document.cookie.split("=")[1];
  },
};
</script>
