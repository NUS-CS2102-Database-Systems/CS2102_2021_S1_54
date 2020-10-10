const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

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

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
