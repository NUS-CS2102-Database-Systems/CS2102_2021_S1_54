<template>
  <div>
    <form @submit="submit" style="border:1px solid #ccc">
      <div class="container">
        <h1>Apply For Leave</h1>
        <p>Please fill in this form to apply for leave.</p>
        <hr />

        <label for="reason"><b>Reason for Leave</b></label>
        <input
          type="text"
          placeholder="Enter Reason"
          name="reason"
          v-model="reason"
          required
        />

        <label for="start_date"><b>Start Date</b></label>
        <input
          type="text"
          placeholder="Enter Start Date (YYYY-MM-DD)"
          name="start_date"
          v-model="start_date"
          required
        />

        <label for="end_date"><b>End Date</b></label>
        <input
          type="text"
          placeholder="Enter End Date (YYYY-MM-DD)"
          name="end_date"
          v-model="end_date"
          required
        />
        
        <div class="clearfix">
          <button type="button" class="cancelbtn">
            <router-link tag="span" to="/full-time-caretakers">Cancel</router-link>
          </button>
          <button type="submit" class="signupbtn">Confirm</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from 'axios';
import * as constants from "../constants";

export default {
  name: "FullTimeCaretakerApplyForLeave",
  data() {
    return {
        username: null,
        reason: "",
        start_date: "",
        end_date: ""
    };
  },
  methods: {
    async submit(e) {
      e.preventDefault();
      let data_ok = true;

      if (this.start_date != null) {
        if (this.start_date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
          var date = new Date(this.start_date);
          if (date instanceof Date && !isNaN(date.valueOf())) {
            let year = this.start_date.slice(0, 4);
            let curr_date = new Date();
            let curr_year = curr_date.getFullYear();
            if (parseInt(year) > curr_year) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please provide a valid start date",
              });
              this.start_date = null;
              data_ok = false;
            } else {
              console.log(this.start_date);
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please provide a valid start date",
            });
            this.start_date = null;
            data_ok = false;
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please provide a valid start date",
          });
          this.start_date = null;
          data_ok = false;
        }
      }

      if (this.end_date != null) {
        if (this.end_date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
          date = new Date(this.end_date);
          if (date instanceof Date && !isNaN(date.valueOf())) {
            let year = this.end_date.slice(0, 4);
            let curr_date = new Date();
            let curr_year = curr_date.getFullYear();
            if (parseInt(year) > curr_year) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please provide a valid end date",
              });
              this.end_date = null;
              data_ok = false;
            } else {
              console.log(this.end_date);
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please provide a valid end date",
            });
            this.end_date = null;
            data_ok = false;
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please provide a valid end date",
          });
          this.end_date = null;
          data_ok = false;
        }
      }

      if (data_ok == true) {
        const result = await axios({
          method: "post",
          url: "https://pet-care-service.herokuapp.com/apply-leave",
            data: {
                username: this.username,
                reason_for_leave: this.reason,
                start_date: this.start_date,
                end_date: this.end_date,
            }
        })

        if (result.data === "Leave submitted!") {
            console.log("apply leave successful");
            window.location.href = constants.full_time_caretaker_home;
        }

      }
    },
  },
  mounted() {
      this.username = document.cookie.split("=")[1];
  }
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

#petType {
  display: none;
}

</style>