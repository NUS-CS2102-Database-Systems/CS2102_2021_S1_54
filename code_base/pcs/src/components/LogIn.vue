<template>
  <div>
    <form @submit="logIn" style="border:1px solid #ccc">
      <div class="container">
        <h1>Log In</h1>
        <p>Please fill in your account details to log in.</p>
        <hr />

        <label for="type"><b>I am a ...</b></label>
        <select id="type" name="type" v-model="type" required>
          <option value="petOwner">Pet Owner</option>
          <option value="fulltimeCaretaker">Full Time Caretaker</option>
          <option value="parttimeCaretaker">Part Time Caretaker</option>
          <option value="pcsAdmin">PCS Admin</option>
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
          <button type="submit" class="signupbtn">Log In</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
// import * as constants from "./constants";

export default {
  name: "LogIn",
  data() {
    return {
      type: "",
      username: "",
      password: "",
    };
  },
  methods: {
    logIn(e) {
      e.preventDefault();
      const user = {
        type: this.type,
        username: this.username,
        password: this.password,
      };

      console.log(user);
      console.log(this.username);
      console.log(this.type);

      // this.$emit("log-in", user);
      // this.type = "";
      // this.username = "";
      // this.password = "";
      const username_logged_in = this.username;

      if (this.type == "petOwner") {
        document.cookie = "pet_owner_username=" + username_logged_in;
        console.log("cookie: " + document.cookie);
        this.$router.push({
          path: "pet-owners",
          query: { pet_owner_username: username_logged_in },
        });
      } else if (this.type == "parttimeCaretaker") {
        document.cookie = "pt_caretaker_username=" + username_logged_in;
        console.log("cookie: " + document.cookie);
        this.$router.push({
          path: "part-time-caretakers",
          query: { caretaker_username: username_logged_in },
        });
      } else if (this.type == "fulltimeCaretaker") {
        document.cookie = "ft_caretaker_username=" + username_logged_in;
        console.log("cookie: " + document.cookie);
        this.$router.push({
          path: "full-time-caretakers",
          query: { caretaker_username: username_logged_in },
        });
      }
    },
  },
  async mounted() {
    var allCookies = document.cookie.split(";");
    console.log("ALL cookies: " + allCookies);

    // The "expire" attribute of every cookie is
    // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
    for (var i = 0; i < allCookies.length; i++) {
      console.log("All cookies i: " + allCookies[i]);
      document.cookie = allCookies[i] + ";max-age=0";
      console.log("In loop: " + document.cookie);
    }

    console.log("ALL cookies after delete: " + document.cookie);
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
