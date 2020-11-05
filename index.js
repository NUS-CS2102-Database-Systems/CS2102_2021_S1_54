const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes/routes.js");
const login_signup_routes = require("./routes/login_signup_routes.js");
const admin_routes = require("./routes/admin_routes.js");
const apply_leave_routes = require("./routes/apply_leave_routes.js");
const admin_view_all_cared_by_each_caretaker = require("./routes/pcs_admin_view_all_cared_pets_per_caretaker_routes.js");
const caretaker_profile_routes = require("./routes/caretaker_profile_routes.js");
const caretaker_view_jobs_routes = require("./routes/caretaker_view_jobs_routes.js");
const part_time_caretaker_availability_routes = require("./routes/part_time_caretaker_availability_routes.js");
const pet_owner_profile_routes = require("./routes/pet_owner_profile_routes.js");
const pet_owner_view_caretakers_routes = require("./routes/pet_owner_view_caretakers_routes.js");
const pet_owner_view_jobs_routes = require("./routes/pet_owner_view_jobs_routes.js");
const pet_profile_routes = require("./routes/pet_profile_routes.js");
const review_routes = require("./routes/review_routes.js");

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors());
// to support JSON-encoded bodies
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: false,
  })
);

// to support JSON-encoded bodies
app.use(express.json());

// to support URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// our routes go here
routes(app);
login_signup_routes(app);
admin_routes(app);
apply_leave_routes(app);
admin_view_all_cared_by_each_caretaker(app);
caretaker_profile_routes(app);
caretaker_view_jobs_routes(app);
part_time_caretaker_availability_routes(app);
pet_owner_profile_routes(app);
pet_owner_view_caretakers_routes(app);
pet_owner_view_jobs_routes(app);
pet_profile_routes(app);
review_routes(app);

app.listen(process.env.PORT || 3000, function () {
  console.log("Example app listening on port %d", this.address().port);
});
