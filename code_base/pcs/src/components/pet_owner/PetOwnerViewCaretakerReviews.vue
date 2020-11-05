<template>
  <v-container>
    <div style="width: 20%; float: left">
      <PetOwnerNavBar />
    </div>
    <div style="width: 80%; float: right">
        <h1> Viewing {{this.caretaker_username}}'s Reviews </h1>
      <template v-if="loaded && have_data">
        <br />
        <v-col class="mx-auto">
          <v-list v-for="(number, i) in id_odd" :key="number">
            <v-row>
              <v-card width="45%">
                <v-card-title> Review {{ number }} </v-card-title>
                <v-card-text>
                  Reviewer: {{ reviewer_odd[i] }} <br />
                  Rating: {{ rating_odd[i] }} <br />
                  Review: {{ review_odd[i] }} <br />
                  Review Written At: {{ review_time_odd[i] }} <br />
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
                <v-card-title> Review {{ number }} </v-card-title>
                <v-card-text>
                  Reviewer: {{ reviewer_even[i] }} <br />
                  Rating: {{ rating_even[i] }} <br />
                  Review: {{ review_even[i] }} <br />
                  Review Written At: {{ review_time_even[i] }} <br />
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
import PetOwnerNavBar from "./PetOwnerNavBar";
import axios from "axios";

export default {
  name: "PetOwnerViewCaretakerReviews",
  components: {
    PetOwnerNavBar,
  },
  data: () => ({
    have_data: false,
    loaded: false,
    id_odd: [],
    id_even: [],
    reviewer_odd: [],
    reviewer_even: [],
    rating_odd: [],
    rating_even: [],
    review_odd: [],
    review_even: [],
    review_time_odd: [],
    review_time_even: []
  }),
  props: {
      caretaker_username: {
          type: String,
          default: "caretaker"
      }
  },
  async mounted() {
    await axios
      .get(`https://pet-care-service.herokuapp.com/reviews/${this.caretaker_username}`)
      .then((response) => {
        let length = response.data.length;
        if (length == 0) {
          this.have_data = false;
        } else {
          this.have_data = true;
          for (let i = 0; i < length; i++) {
            if (i % 2 == 0) {
              this.id_odd.push(i + 1);
              this.reviewer_odd.push(response.data[i].reviewer)
              this.rating_odd.push(response.data[i].rating);
              this.review_odd.push(response.data[i].review);
              this.review_time_odd.push(response.data[i].review_time);
            } else {
              this.id_even.push(i + 1);
              this.reviewer_even.push(response.data[i].reviewer);
              this.rating_even.push(response.data[i].rating);
              this.review_even.push(response.data[i].review);
              this.review_time_even.push(response.data[i].review_time);
            }
          }
        }
      });
    this.loaded = true;
    },
};
</script>
