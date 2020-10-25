<template>
  <div>
    <form @submit="submitReview" style="border:1px solid #ccc">
      <div class="container">
        <h1>Submit a Review</h1>
        <p>You are writing a review for {{ this.caretaker_username }}</p>
        <hr />

        <label for="review"><b>Review</b></label>
        <input
          type="text"
          placeholder="Enter review..."
          name="review"
          v-model="review"
          required
        />

        <label for="rating"><b>Rating</b></label>
        <select id="rating" name="rating" v-model="rating" required>
          <option value="1">1 (hmm...) </option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5 (great!) </option>
        </select>

        <div class="clearfix">
          <button type="button" class="cancelbtn">Cancel</button>
          <button type="submit" class="signupbtn">Sign Up</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "PetOwnerSubmitReview",

  data() {
    return {
      caretaker_username: "caretaker",
      review: "",
      rating: 5,
    };
  },
  methods: {
    submitReview(e) {
      e.preventDefault();
      const review = {
        caretaker_username: this.caretaker_username,
        review: this.review,
        rating: this.rating,
      };

      console.log(review);

      this.$emit("submit-review", review);
      // delete this later
      this.caretaker_username = "";
      this.review = "";
      this.rating = "";
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
}
input[type="text"] {
  align-self: center;
  width: 100;
  padding: 5px;
}
input[type="submit"] {
  flex: 2;
}

* {
  box-sizing: border-box;
}

/* Full-width input fields */
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
}

input[type="text"]:focus,
input[type="password"]:focus {
  background-color: #ddd;
  outline: none;
}

select {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
}

hr {
  border: 1px solid #f1f1f1;
  margin-bottom: 25px;
}

/* Set a style for all buttons */
button {
  background-color: #4caf50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
}

button:hover {
  opacity: 1;
}

/* Extra styles for the cancel button */
.cancelbtn {
  padding: 14px 20px;
  background-color: #f44336;
}

/* Float cancel and signup buttons and add an equal width */
.cancelbtn,
.signupbtn {
  float: left;
  width: 50%;
}

/* Add padding to container elements */
.container {
  padding: 16px;
}

/* Clear floats */
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}

/* Change styles for cancel button and signup button on extra small screens */
@media screen and (max-width: 300px) {
  .cancelbtn,
  .signupbtn {
    width: 100%;
  }
}
</style>
