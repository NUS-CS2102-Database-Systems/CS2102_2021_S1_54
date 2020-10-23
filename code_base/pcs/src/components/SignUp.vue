<template>
  <div>
    <!-- <form >
            <input type="text" name="username" v-model="username" placeholder="Enter your username...">

            <input type="submit" value='Submit' class='btn'>
        </form> -->

    <form @submit="signUp" style="border:1px solid #ccc">
      <div class="container">
        <h1>Sign Up</h1>
        <p>Please fill in this form to create an account.</p>
        <hr />

        <label for="type"><b>I am a ...</b></label>
        <select id="type" name="type" v-model="type" required>
          <option value="petOwner">Pet Owner</option>
          <option value="fulltimeCaretaker">Full Time Caretaker</option>
          <option value="parttimeCaretaker">Part Time Caretaker</option>
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

        <label for="name"><b>Name</b></label>
        <input
          type="text"
          placeholder="Enter Full Name"
          name="name"
          v-model="name"
          required
        />

        <label for="dob"><b>Date of Birth</b></label>
        <input
          type="text"
          placeholder="Enter Date of Birth (YYYY-MM-DD)"
          name="dob"
          v-model="dob"
          required
        />
        <br />
        <label for="gender"><b>Gender</b></label>
        <select id="gender" name="gender" v-model="gender" required>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label for="phone"><b>Phone Number</b></label>
        <input
          type="text"
          placeholder="Enter Phone Number"
          name="phone"
          v-model="phone"
          required
        />

        <label for="email"><b>Email</b></label>
        <input
          type="text"
          placeholder="Enter Email"
          name="email"
          v-model="email"
          required
        />

        <label for="address"><b>Address</b></label>
        <input
          type="text"
          placeholder="Enter Address"
          name="address"
          v-model="address"
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
import Swal from "sweetalert2";

export default {
  name: "SignUp",
  data() {
    return {
      type: "",
      username: "",
      password: "",
      name: "",
      dob: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
    };
  },
  methods: {
    signUp(e) {
      e.preventDefault();
      let data_ok = true;
      let name_lowercase = this.name.toString().toLowerCase();
      this.name = name_lowercase.replace(/(^\w{1})|(\s{1}\w{1})/g, (match) =>
        match.toUpperCase()
      );

      if (this.email != null) {
        if (
          this.email.match(
            /^([a-z]|[A-Z])+(!|#|\$|%|&|'|\*|\+|-|\/|\/|=|\?|\^|_|`|\{|\}|\|){0,2}(([a-z]|[A-Z]|[0-9])+)*@([a-z]|[A-Z])+(-)?\.([a-z])+(\.([a-z])+)?$/
          )
        ) {
          console.log(this.email);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please provide a valid email address",
          });
          this.email = null;
          data_ok = false;
        }
      }

      if (this.phone != null) {
        if (this.phone.match(/^(9|8|6)[0-9]{7}$/)) {
          console.log(this.phone);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please provide a valid phone number",
          });
          this.phone = null;
          data_ok = false;
        }
      }

      if (this.dob != null) {
        if (this.dob.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
          var date = new Date(this.dob);
          if (date instanceof Date && !isNaN(date.valueOf())) {
            let year = this.dob.slice(0, 4);
            let curr_date = new Date();
            let curr_year = curr_date.getFullYear();
            if (parseInt(year) > curr_year) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please provide a valid date of birth",
              });
              this.dob = null;
              data_ok = false;
            } else {
              console.log(this.dob);
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please provide a valid date of birth",
            });
            this.dob = null;
            data_ok = false;
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please provide a valid date of birth",
          });
          this.dob = null;
          data_ok = false;
        }
      }

      if (data_ok == true) {
        const newUser = {
          type: this.type,
          username: this.username,
          password: this.password,
          name: this.name,
          dob: this.dob,
          gender: this.gender,
          phone: this.phone,
          email: this.email,
          address: this.address,
        };

        console.log(newUser);

        this.$emit("sign-up", newUser);
        this.username = "";
        this.type = "";
        this.password = "";
        this.name = "";
        this.dob = "";
        this.gender = "";
        this.phone = "";
        this.email = "";
        this.address = "";
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
