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
                <hr>
                
                <label for="type"><b>I am a ...</b></label>
                    <select id="type" name="type" v-model="type" required>
                        <option value="petOwner">Pet Owner</option>
                        <option value="fulltimeCaretaker">Full Time Caretaker</option>
                        <option value="parttimeCaretaker">Part Time Caretaker</option>
                    </select>

                <label for="username"><b>Username</b></label>
                <input type="text" placeholder="Enter Username" name="username" v-model="username" required>

                <label for="password"><b>Password</b></label>
                <input type="password" placeholder="Enter Password" name="password" v-model="password" required>

                <label for="name"><b>Name</b></label>
                <input type="text" placeholder="Enter Full Name" name="name" v-model="name" required>

                <label for="dob"><b>Date of Birth</b></label>
                <input type="text" placeholder="Enter Date of Birth" name="dob" v-model="dob" required>

                <label for="gender"><b>Gender</b></label>
                    <select id="gender" name="gender" v-model="gender" required>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>

                <label for="phone"><b>Phone Number</b></label>
                <input type="text" placeholder="Enter Phone Number" name="phone" v-model="phone" required>

                <label for="email"><b>Email</b></label>
                <input type="text" placeholder="Enter Email" name="email" v-model="email" required>

                <label for="address"><b>Address</b></label>
                <input type="text" placeholder="Enter Address" name="address" v-model="address" required>

                <div class="clearfix">
                <button type="button" class="cancelbtn"><router-link tag="span" to='/'>Cancel</router-link></button>
                <button type="submit" class="signupbtn">Sign Up</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: "SignUp",
    data() {
        return {
            type: '',
            username: '',
            password: '',
            name: '',
            dob: '',
            gender: '',
            phone: '',
            email: '',
            address: ''
        }
    },
    methods: {
        signUp(e) {
            e.preventDefault();
            const newUser = {
                type: this.type,
                username: this.username,
                password: this.password,
                name: this.name,
                dob: this.dob,
                gender: this.gender,
                phone: this.phone,
                email: this.email,
                address: this.address
            }

            console.log(newUser)

            this.$emit('sign-up', newUser);
            this.username = '';
            this.type = '';
            this.password = '';
            this.name = '';
            this.dob = '';
            this.gender = '';
            this.phone = '';
            this.email = '';
            this.address = '';
        }
    }
}
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

* {box-sizing: border-box}

/* Full-width input fields */
  input[type=text], input[type=password] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
}

input[type=text]:focus, input[type=password]:focus {
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
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
}

button:hover {
  opacity:1;
}

/* Extra styles for the cancel button */
.cancelbtn {
  padding: 14px 20px;
  background-color: #f44336;
}

/* Float cancel and signup buttons and add an equal width */
.cancelbtn, .signupbtn {
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
  .cancelbtn, .signupbtn {
    width: 100%;
  }
}

</style>