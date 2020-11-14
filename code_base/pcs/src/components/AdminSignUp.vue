<template>
  <div>
    <form @submit="signUp" style="border:1px solid #ccc">
      <div class="container">
        <h1>Administrator Sign Up</h1>
        <p>Please fill in this form to create an admin account.</p>
        <hr />

        <label for="username"><b>Username</b></label>
        <input
          type="text"
          placeholder="Enter Username"
          name="username"
          v-model="username"
          required
        />

        <label for="password"><b>Password</b></label>
        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          v-model="password"
          required
        />
        <div class="clearfix">
            <button type="button" class="cancelbtn">
            <router-link tag="span" to="/">Cancel</router-link>
            </button>
            <button type="submit" class="signupbtn">Sign Up</button>
        </div>
        </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: "AdminSignUp",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async signUp(e) {
      e.preventDefault();
      var data_ok = true;
    
      if (this.password === null || this.username === null) {
          data_ok = false;
      }

      if (data_ok == true) {
        const result = await axios({
          method: "post",
          url: "https://pet-care-service.herokuapp.com/admins",
          data: {
            username: this.username,
            password: this.password
          }
        })
        if (result.data !== "admin username already exists!") {
          Swal.fire({
            icon: "success",
            title: "Signed Up Successfully!",
            text: "You may log in to your new account from the Home page.",
          });
          this.$router.push({
            path: "/"
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Admin Already Exists!",
            text: "An Administrator with the same username already exists. Please choose a different username.",
          });
        }
      }
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
input[type="password"],
input[type="date"] {
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
