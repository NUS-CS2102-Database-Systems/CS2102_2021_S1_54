const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
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
const caretaker_view_salary_num_pets_and_days = require("./routes/caretaker_view_salary_num_pets_and_days.js");
const pcs_admin_profile = require("./routes/pcs_admin_profile_routes.js");
const pcs_admin_home_routes = require("./routes/pcs_admin_home_routes.js");
const pcs_admin_set_price_routes = require("./routes/pcs_admin_set_price_routes.js");
const pcs_admin_show_caretaker_details = require("./routes/pcs_admin_show_caretaker_details.js");
const pet_owner_bid_caretakers_route = require("./routes/pet_owner_bid_caretakers_routes.js");
const pet_owner_home_route = require("./routes/pet_owner_home.js");

//here we are configuring dist to serve app files
app.use("/", serveStatic(path.join(__dirname, "/code_base/pcs/dist")));

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
login_signup_routes(app);
admin_routes(app);
apply_leave_routes(app);
admin_view_all_cared_by_each_caretaker(app);
caretaker_profile_routes(app);
caretaker_view_jobs_routes(app);
caretaker_view_salary_num_pets_and_days(app);
part_time_caretaker_availability_routes(app);
pet_owner_profile_routes(app);
pet_owner_view_caretakers_routes(app);
pet_owner_view_jobs_routes(app);
pet_profile_routes(app);
review_routes(app);
pcs_admin_profile(app);
pcs_admin_home_routes(app);
pcs_admin_set_price_routes(app);
pcs_admin_show_caretaker_details(app);
pet_owner_bid_caretakers_route(app);
pet_owner_home_route(app);

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, "/code_base/pcs/dist/index.html"));
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Example app listening on port %d", this.address().port);
});
