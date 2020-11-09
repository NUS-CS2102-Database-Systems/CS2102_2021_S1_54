<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
      <template v-if="loaded && have_data">
        <h2>Hello {{ username }}!</h2>
        <br />
        <h2>Your pets under our care at the moment:</h2>
        <br />
        <v-row>
          <v-col class="mx-auto">
            <v-list v-for="(number, i) in id_odd" :key="number">
              <v-row>
                <v-card width="55%">
                  <v-card-title> Job {{ number }} </v-card-title>
                  <v-card-text>
                    <h3>Caretaker Information</h3>
                    Caretaker Username: {{ caretaker_odd[i] }} <br />
                    Caretaker Name: {{ caretaker_name_odd[i] }} <br />
                    Caretaker Phone: {{ caretaker_phone_odd[i] }} <br />
                    Caretaker Address: {{ caretaker_address_odd[i] }} <br />
                    <h3>Job Information</h3>
                    Pet Name: {{ pet_odd[i] }} <br />
                    Job Started: {{ job_start_odd[i] }} <br />
                    Job End: {{ job_end_odd[i] }} <br />
                    Transfer Method (Pick Up):
                    {{ start_transfer_method_odd[i] }}
                    <br />
                    Transfer Method (Drop Off): {{ end_transfer_method_odd[i] }}
                    <br />
                    Amount: {{ amount_odd[i] }} <br />
                    Paid By: {{ payment_method_odd[i] }} <br />
                    Payment Date and Time: {{ payment_datetime_odd[i] }} <br />
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
                    <h3>Caretaker Information</h3>
                    Caretaker Username: {{ caretaker_even[i] }} <br />
                    Caretaker Name: {{ caretaker_name_even[i] }} <br />
                    Caretaker Phone: {{ caretaker_phone_even[i] }} <br />
                    Caretaker Address: {{ caretaker_address_even[i] }} <br />
                    <h3>Job Information</h3>
                    Pet Name: {{ pet_even[i] }} <br />
                    Job Started: {{ job_start_even[i] }} <br />
                    Job End: {{ job_end_even[i] }} <br />
                    Transfer Method (Pick Up):
                    {{ start_transfer_method_even[i] }}
                    <br />
                    Transfer Method (Drop Off):
                    {{ end_transfer_method_even[i] }}
                    <br />
                    Amount: {{ amount_even[i] }} <br />
                    Paid By: {{ payment_method_even[i] }} <br />
                    Payment Date and Time: {{ payment_datetime_even[i] }} <br />
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
              Hi {{ username }}. You have no pets under our care at the moment.
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
import axios from "axios";

export default {
  name: "PetOwnerViewOngoingJobs",

  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    loaded: false,
    have_data: false,
    username: null,
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
    caretaker_name_odd: [],
    caretaker_name_even: [],
    caretaker_phone_odd: [],
    caretaker_phone_even: [],
    caretaker_address_odd: [],
    caretaker_address_even: [],
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
        "https://pet-care-service.herokuapp.com/pet-owners/get-ongoing-jobs-information",
        {
          toGet: get_info,
        }
      )
      .then((response) => {
        let length = response.data.length;
        console.log(length);
        console.log(response.data);
        if (length == 0) {
          this.have_data = false;
        } else {
          this.have_data = true;
          for (let i = 0; i < length; i++) {
            if (i % 2 == 0) {
              this.id_odd.push(i + 1);
              this.caretaker_odd.push(response.data[i].username);
              this.caretaker_name_odd.push(response.data[i].name);
              this.caretaker_phone_odd.push(response.data[i].phone);
              this.caretaker_address_odd.push(response.data[i].address);
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
              this.payment_method_odd.push(response.data[i].payment_method);
              let date_time =
                response.data[i].payment_datetime.split("T")[0] +
                " " +
                response.data[i].payment_datetime.split("T")[1].split(".")[0];
              this.payment_datetime_odd.push(date_time);
            } else {
              this.id_even.push(i + 1);
              this.caretaker_even.push(response.data[i].username);
              this.caretaker_name_even.push(response.data[i].name);
              this.caretaker_phone_even.push(response.data[i].phone);
              this.caretaker_address_even.push(response.data[i].address);
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
