const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes/routes.js");
const login_signup_routes = require("./routes/login_signup_routes.js");

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

app.listen(process.env.PORT || 3000, function () {
  console.log("Example app listening on port %d", this.address().port);
});


app.on('listening', function () {
  seeder();
});



