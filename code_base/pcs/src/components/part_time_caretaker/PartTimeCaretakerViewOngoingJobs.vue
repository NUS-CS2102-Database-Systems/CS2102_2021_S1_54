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
        <v-row>
          <v-col class="mx-auto">
            <v-list v-for="(number, i) in id_odd" :key="number">
              <v-row>
                <v-card width="45%">
                  <v-card-title> Job {{ number }} </v-card-title>
                  <v-card-text>
                    <h3 style="color:black">Job Information</h3>
                    <p style="color:black">
                      Pet Owner Username: {{ pet_owner_odd[i] }} <br />
                      Pet Name: {{ pet_odd[i] }} <br />
                      Job Started: {{ job_start_odd[i] }} <br />
                      Job Ended: {{ job_end_odd[i] }} <br />
                      Transfer Method (Pick Up):
                      {{ start_transfer_method_odd[i] }}
                      <br />
                      Transfer Method (Drop Off):
                      {{ end_transfer_method_odd[i] }}
                      <br />
                      Amount: {{ amount_odd[i] }} <br />
                      Paid By: {{ payment_method_odd[i] }} <br />
                      Payment Date and Time: {{ payment_datetime_odd[i] }}
                      <br />
                    </p>

                    <h3 style="color:black">Pet Owner Information</h3>
                    <p style="color:black">
                      Name: {{ pet_owner_name_odd[i] }} <br />
                      Gender: {{ pet_owner_gender_odd[i] }} <br />
                      Phone: {{ pet_owner_phone_odd[i] }}
                      <br />
                      Email: {{ pet_owner_email_odd[i] }} <br />
                      Address: {{ pet_owner_address_odd[i] }} <br />
                    </p>

                    <h3 style="color:black">Pet Information</h3>
                    <p style="color:black">
                      Age: {{ pet_age_odd[i] }} <br />
                      Gender: {{ pet_gender_odd[i] }} <br />
                      Breed: {{ pet_breed_odd[i] }} <br />
                      Type of Animal: {{ type_of_animal_odd[i] }}
                      <br />
                      Medical History: {{ pet_med_hist_odd[i] }}
                      <br />
                      Special Requirements: {{ pet_special_req_odd[i] }} <br />
                    </p>
                  </v-card-text>
                </v-card>
              </v-row>
            </v-list>
          </v-col>
          <v-col class="mx-auto">
            <v-list v-for="(number, i) in id_even" :key="number">
              <v-row>
                <v-card width="55%">
                  <v-card-title> Job {{ number }} </v-card-title>
                  <v-card-text>
                    <h3 style="color:black">Job Information</h3>
                    <p style="color:black">
                      Pet Owner Username: {{ pet_owner_even[i] }} <br />
                      Pet Name: {{ pet_even[i] }} <br />
                      Job Started: {{ job_start_even[i] }} <br />
                      Job Ended: {{ job_end_even[i] }} <br />
                      Transfer Method (Pick Up):
                      {{ start_transfer_method_even[i] }}
                      <br />
                      Transfer Method (Drop Off):
                      {{ end_transfer_method_even[i] }}
                      <br />
                      Amount: {{ amount_even[i] }} <br />
                      Paid By: {{ payment_method_even[i] }} <br />
                      Payment Date and Time: {{ payment_datetime_even[i] }}
                      <br />
                    </p>

                    <h3 style="color:black">Pet Owner Information</h3>
                    <p style="color:black">
                      Name: {{ pet_owner_name_even[i] }} <br />
                      Gender: {{ pet_owner_gender_even[i] }} <br />
                      Phone: {{ pet_owner_phone_even[i] }}
                      <br />
                      Email: {{ pet_owner_email_even[i] }} <br />
                      Address: {{ pet_owner_address_even[i] }} <br />
                    </p>

                    <h3 style="color:black">Pet Information</h3>
                    <p style="color:black">
                      Age: {{ pet_age_even[i] }} <br />
                      Gender: {{ pet_gender_even[i] }} <br />
                      Breed: {{ pet_breed_even[i] }} <br />
                      Type of Animal: {{ type_of_animal_even[i] }}
                      <br />
                      Medical History: {{ pet_med_hist_even[i] }}
                      <br />
                      Special Requirements: {{ pet_special_req_even[i] }} <br />
                    </p>
                  </v-card-text>
                </v-card>
              </v-row>
            </v-list>
          </v-col>
        </v-row>
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
import axios from "axios";

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
    payment_method_even: [],
    payment_method_odd: [],
    payment_datetime_even: [],
    payment_datetime_odd: [],
  }),
  async mounted() {
    this.username = document.cookie.split("=")[1];

    const get_info = {
      username: this.username,
    };

    await axios
      .post(
        "https://pet-care-service.herokuapp.com/caretakers/get-ongoing-jobs-information",
        {
          toGet: get_info,
        }
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
              this.pet_owner_odd.push(response.data[i].pusername);
              this.pet_odd.push(response.data[i].pet_name);
              let job_start =
                response.data[i].job_start_datetime.split("T")[0] +
                " " +
                response.data[i].job_start_datetime.split("T")[1].split(".")[0];
              this.job_start_odd.push(job_start);
              let job_end =
                response.data[i].job_end_datetime.split("T")[0] +
                " " +
                response.data[i].job_end_datetime.split("T")[1].split(".")[0];
              this.job_end_odd.push(job_end);
              this.start_transfer_method_odd.push(
                response.data[i].start_transfer_method
              );
              this.end_transfer_method_odd.push(
                response.data[i].end_transfer_method
              );
              this.amount_odd.push(response.data[i].amount);
              this.pet_owner_name_odd.push(response.data[i].name);
              this.pet_owner_gender_odd.push(response.data[i].gender);
              this.pet_owner_phone_odd.push(response.data[i].phone);
              this.pet_owner_email_odd.push(response.data[i].email);
              this.pet_owner_address_odd.push(response.data[i].address);
              let pet_age = null;

              if (
                response.data[0].pet_age.months != undefined &&
                pet_age == null
              ) {
                pet_age = response.data[0].pet_age.months + " months ";
              } else if (
                response.data[0].pet_age.months != undefined &&
                pet_age != null
              ) {
                pet_age += response.data[0].pet_age.months + " months ";
              }

              if (
                response.data[0].pet_age.days != undefined &&
                pet_age == null
              ) {
                pet_age = response.data[0].pet_age.days + " days";
              } else if (
                response.data[0].pet_age.days != undefined &&
                pet_age != null
              ) {
                pet_age += response.data[0].pet_age.days + " days";
              }
              this.pet_age_odd.push(pet_age);
              this.pet_gender_odd.push(response.data[i].pet_gender);
              this.pet_breed_odd.push(response.data[i].breed);
              this.type_of_animal_odd.push(response.data[i].type_of_animal);
              this.pet_med_hist_odd.push(response.data[i].med_hist);
              this.pet_special_req_odd.push(response.data[i].special_req);
              this.payment_method_odd.push(response.data[i].payment_method);
              let date_time =
                response.data[i].payment_datetime.split("T")[0] +
                " " +
                response.data[i].payment_datetime.split("T")[1].split(".")[0];
              this.payment_datetime_odd.push(date_time);
            } else {
              this.id_even.push(i + 1);
              this.caretaker_even.push(response.data[i].cusername);
              this.pet_even.push(response.data[i].pet_name);
              let job_start =
                response.data[i].job_start_datetime.split("T")[0] +
                " " +
                response.data[i].job_start_datetime.split("T")[1].split(".")[0];
              this.job_start_even.push(job_start);
              let job_end =
                response.data[i].job_end_datetime.split("T")[0] +
                " " +
                response.data[i].job_end_datetime.split("T")[1].split(".")[0];
              this.job_end_even.push(job_end);
              this.start_transfer_method_even.push(
                response.data[i].start_transfer_method
              );
              this.end_transfer_method_even.push(
                response.data[i].end_transfer_method
              );
              this.amount_even.push(response.data[i].amount);
              this.pet_owner_name_even.push(response.data[i].name);
              this.pet_owner_gender_even.push(response.data[i].gender);
              this.pet_owner_phone_even.push(response.data[i].phone);
              this.pet_owner_email_even.push(response.data[i].email);
              this.pet_owner_address_even.push(response.data[i].address);
              let pet_age = null;

              if (
                response.data[0].pet_age.months != undefined &&
                pet_age == null
              ) {
                pet_age = response.data[0].pet_age.months + " months ";
              } else if (
                response.data[0].pet_age.months != undefined &&
                pet_age != null
              ) {
                pet_age += response.data[0].pet_age.months + " months ";
              }

              if (
                response.data[0].pet_age.days != undefined &&
                pet_age == null
              ) {
                pet_age = response.data[0].pet_age.days + " days";
              } else if (
                response.data[0].pet_age.days != undefined &&
                pet_age != null
              ) {
                pet_age += response.data[0].pet_age.days + " days";
              }
              this.pet_age_even.push(pet_age);
              this.pet_gender_even.push(response.data[i].pet_gender);
              this.pet_breed_even.push(response.data[i].breed);
              this.type_of_animal_even.push(response.data[i].type_of_animal);
              this.pet_med_hist_even.push(response.data[i].med_hist);
              this.pet_special_req_even.push(response.data[i].special_req);
              this.payment_method_even.push(response.data[i].payment_method);
              let date_time =
                response.data[i].payment_datetime.split("T")[0] +
                " " +
                response.data[i].payment_datetime.split("T")[1].split(".")[0];
              this.payment_datetime_even.push(date_time);
            }
          }
        }
      });
    this.loaded = true;
  },
};
</script>
