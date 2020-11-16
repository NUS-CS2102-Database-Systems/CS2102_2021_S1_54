<template>
  <div>
    <form @submit="submitChanges" style="border:1px solid #ccc">
      <div class="container">
        <h1>Set Base Daily Prices</h1>
        <p>Set base daily prices for different animal types (unit: SGD)</p>
        <hr />

        <label for="smallDog"><b>Small Dog</b></label>
        <input
          type="text"
          placeholder="Enter price..."
          name="smallDog"
          v-model="smallDogPrice"
          required
        />

        <label for="bigDog"><b>Big Dog</b></label>
        <input
          type="text"
          placeholder="Enter price..."
          name="bigDog"
          v-model="bigDogPrice"
          required
        />

        <label for="cat"><b>Cat</b></label>
        <input
          type="text"
          placeholder="Enter price..."
          name="cat"
          v-model="catPrice"
          required
        />

        <label for="bird"><b>Bird</b></label>
        <input
          type="text"
          placeholder="Enter price..."
          name="bird"
          v-model="birdPrice"
          required
        />

        <label for="rabbit"><b>Rabbit</b></label>
        <input
          type="text"
          placeholder="Enter price..."
          name="rabbit"
          v-model="rabbitPrice"
          required
        />

        <label for="rodent"><b>Rodent</b></label>
        <input
          type="text"
          placeholder="Enter price..."
          name="rodent"
          v-model="rodentPrice"
          required
        />

        <div class="clearfix">
          <button type="button" class="cancelbtn">
            <router-link tag="span" to="/pcs-admin">
              Cancel
            </router-link>
            </button>
          <button type="submit" class="signupbtn">Confirm Changes</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
import * as constants from "../constants";

export default {
  name: "PcsAdminSetBaseDailyPrice",

  data() {
    return {
      username: null,
      password: null,
      smallDogPrice: null,
      bigDogPrice: null,
      catPrice: null,
      birdPrice: null,
      rabbitPrice: null,
      rodentPrice: null
    };
  },

  methods: {
    async submitChanges(e) {
      e.preventDefault();
      const newSmallDogPrice = {
        type_name: "small dog",
        base_daily_price: this.smallDogPrice,
        admin_username: this.username
      };
      const newBigDogPrice = {
        type_name: "big dog",
        base_daily_price: this.bigDogPrice,
        admin_username: this.username
      };
      const newCatPrice = {
        type_name: "cat",
        base_daily_price: this.catPrice,
        admin_username: this.username
      };
      const newBirdPrice = {
        type_name: "bird",
        base_daily_price: this.birdPrice,
        admin_username: this.username
      };
      const newRabbitPrice = {
        type_name: "rabbit",
        base_daily_price: this.rabbitPrice,
        admin_username: this.username
      };
      const newrRodentPrice = {
        type_name: "rodent",
        base_daily_price: this.rodentPrice,
        admin_username: this.username
      };

      const newPrices = [newSmallDogPrice, newBigDogPrice, newCatPrice, newBirdPrice, newRabbitPrice, newrRodentPrice];

      var updateSuccessful = true;
      for (let price of newPrices) {
        if (price.base_daily_price === null) {
          continue;
        }
        if (!/^\+?(0|[1-9]\d*)$/.test(price.base_daily_price)) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Price must be an integer. Please enter the correct value.",   
          })
          break;
        }

        // update database
        const response = await axios.post("https://pet-care-service.herokuapp.com/admins/base-daily-prices", price);
        if (response.data.rowCount === 0) {
          updateSuccessful = false;
        }
      }

      if (updateSuccessful) {
        Swal.fire({
          icon: "success",
          title: "Update Successful",
          text: "Base daily prices have been updated successfully.",
        });
        window.location.href = constants.pcs_admin_home;
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong. Please try again later.",
        });
      }
    },
  },

  async mounted() {
    this.username = document.cookie.split("=")[1];

    console.log("user name is " + this.username);

    // load prices from backend if any
    axios.get("https://pet-care-service.herokuapp.com/admins/base-daily-prices")
      .then((response) => {
          for (let elem of response.data) {
            const typeName = elem.type_name;
            switch (typeName) {
              case "small dog":
                this.smallDogPrice = elem.base_daily_price;
                break;
              case "big dog":
                this.bigDogPrice = elem.base_daily_price;
                break;
              case "cat":
                this.catPrice = elem.base_daily_price;
                break;
              case "bird":
                this.birdPrice = elem.base_daily_price;
                break;
              case "rabbit":
                this.rabbitPrice = elem.base_daily_price;
                break;
              case "rodent":
                this.rodentPrice = elem.base_daily_price;
                break;
              default:
                console.log("No animal type matches!");
                break;
            }
          }
    });
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
