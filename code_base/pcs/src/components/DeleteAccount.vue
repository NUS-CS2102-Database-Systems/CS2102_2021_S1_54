<template>
  <div>
    <form @submit="deleteAccount" style="border:1px solid #ccc">
      <div class="container">
        <h1>Delete My Account</h1>
        <p>ATTENTION: This action is irreversible!</p>
        <hr />

        <label for="type"><b>I am a ...</b></label>
        <select id="type" name="type" v-model="type" required>
          <option value="user">User (Pet Owner and/or Caretaker)</option>
          <option value="admin">Administrator</option>
        </select>

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
          <button type="submit" class="signupbtn">Delete Account</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
// import * as constants from "./constants";
import Swal from "sweetalert2";
import axios from 'axios';

export default {
  name: "DeleteAccount",
  data() {
    return {
      username: "",
      password: "",
      type: ""
    };
  },
  methods: {
    async deleteAccount(e) {
      e.preventDefault();

      var authResponse = [];
      if (this.type === "user") { // normal user
        authResponse = await axios({
          method: "post",
          url: "https://pet-care-service.herokuapp.com/users/authenticate",
          data: {
            username: this.username,
            password: this.password,
            type: "general"
          }
        });
      } else { // administrator
        authResponse = await axios({
          method: "post",
          url: "https://pet-care-service.herokuapp.com/admins/authenticate",
          data: {
            username: this.username,
            password: this.password
          }
        });
      }

      if (authResponse.data.length === 1) {
        var result = [];
        if (this.type === "user") { // normal user
          result = await axios({
            method: "delete",
            url: "https://pet-care-service.herokuapp.com/users",
            data: {
              username: this.username,
              password: this.password
            }
          });
        } else { // administrator
          result = await axios({
            method: "delete",
            url: "https://pet-care-service.herokuapp.com/admins",
            data: {
              username: this.username,
              password: this.password
            }
          });
        }

        if (result.data === `${this.username} is deleted!`) {
          Swal.fire({
            icon: "success",
            title: "Account Deleted",
            text: "You account has been permanently deleted."
          })
          this.$router.push({
            path: "/",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops",
          text: "Your username or password is wrong. Please try again."
        })
      }
    }
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
