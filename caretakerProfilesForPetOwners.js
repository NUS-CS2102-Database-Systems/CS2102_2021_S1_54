const e = require("express");

app.get("/pet-care/pet-owners/caretakers", async function (req, res) {
  const get_caretaker_usernames =
    "SELECT username FROM caretaker ORDER BY username ASC";

  try {
    await client.query(get_caretaker_usernames).then((resp) => {
      let arr = [];
      let len = resp.rows.length;
      for (var i = 0; i < len; i++) {
        let result = resp.rows[i];
        arr.push(result);
      }
      res.send(arr);
    });
  } catch (err) {
    console.error(err.stack);
  }
});

app.post("/pet-care/pet-owners/caretakers", async function (req, res) {
  // send the usernames only
  console.log("Received Caretaker request: ", req.body);
  let commitment = req.body.caretaker.commitment;
  let date_from = req.body.caretaker.dates[0];
  let date_to = req.body.caretaker.dates[1];
  let rating_wanted = req.body.caretaker.rating;
  let sort_by = req.body.caretaker.order_by;
  let price_range_from = req.body.caretaker.start_price;
  let price_range_to = req.body.caretaker.end_price;
  let type_of_animal = req.body.caretaker.animal_type;

  var caretakerObject = { fullTime: {}, partTime: {} };

  if (commitment == "full-time") {
    let request_full_time =
      "SELECT username FROM full_time_caretaker" +
      " NATURAL JOIN can_take_care NATURAL JOIN leave_days NATURAL JOIN daily_price_rate" +
      " WHERE";

    if (date_from != null && date_to != null) {
      let add_dates_requested =
        " (from NOT BETWEEN date('" +
        date_from +
        "') AND date('" +
        date_to +
        "') AND to NOT BETWEEN date('" +
        date_from +
        "') AND date('" +
        date_to +
        "')) OR (from BETWEEN date('" +
        date_from +
        "') AND date('" +
        date_to +
        "') AND to NOT BETWEEN date('" +
        date_from +
        "') AND date('" +
        date_to +
        "') AND isApproved = false)";

      request_full_time = request_full_time + add_dates_requested + " AND";
    }

    if (rating_wanted != null) {
      let add_rating_requested =
        " (rating >= " + parseFloat(rating_wanted) + ")";

      request_full_time = request_full_time + add_rating_requested + " AND";
    }

    if (type_of_animal != null) {
      type_of_animal = type_of_animal.replace(/,/g, "' OR type_name = '");
      let add_animal_type_requested = " (type_name = '" + type_of_animal + "')";

      request_full_time =
        request_full_time + add_animal_type_requested + " AND";
    }

    if (price_range_from != null && price_range_to == null) {
      let add_min_price =
        " (current_daily_price >= " + parseFloat(price_range_from) + ")";

      request_full_time = request_full_time + add_min_price + " AND";
    } else if (price_range_from == null && price_range_to != null) {
      let add_max_price =
        " (current_daily_price <= " + parseFloat(price_range_to) + ")";

      request_full_time = request_full_time + add_max_price + " AND";
    } else if (price_range_from != null && price_range_to != null) {
      let add_price_range =
        " (current_daily_price BETWEEN " +
        parseFloat(price_range_from) +
        " AND " +
        parseFloat(price_range_to) +
        ")";

      request_full_time = request_full_time + add_price_range + " AND";
    }

    let request_full_time_split_by_space = request_full_time.trim().split(" ");
    if (
      request_full_time_split_by_space[
        request_full_time_split_by_space.length - 1
      ] == "AND" ||
      request_full_time_split_by_space[
        request_full_time_split_by_space.length - 1
      ] == "WHERE"
    ) {
      request_full_time = request_full_time_split_by_space
        .slice(0, -1)
        .join(" ");
    } else {
      request_full_time = request_full_time_split_by_space.join(" ");
    }

    if (sort_by != null) {
      if (sort_by.length > 1) {
        if (sort_by[0] == "alphabetical a to z") {
          let add_sort_alphebatically_a_to_z = " ORDER BY username ASC,";

          request_full_time =
            request_full_time + add_sort_alphebatically_a_to_z;
        } else if (sort_by[0] == "alphabetical z to a") {
          let add_sort_alphebatically_z_to_a = " ORDER BY username DESC,";

          request_full_time =
            request_full_time + add_sort_alphebatically_z_to_a;
        }

        if (sort_by[1] == "price low to high") {
          let add_sort_price_low_to_high = " current_daily_price ASC";

          request_full_time = request_full_time + add_sort_price_low_to_high;
        } else if (sort_by[1] == "price high to low") {
          let add_sort_price_high_to_low = " current_daily_price DESC";

          request_full_time = request_full_time + add_sort_price_high_to_low;
        }
      } else {
        if (sort_by == "alphabetical a to z") {
          let add_sort_alphebatically_a_to_z_only = " ORDER BY username ASC";

          request_full_time =
            request_full_time + add_sort_alphebatically_a_to_z_only;
        } else if (sort_by == "alphabetical z to a") {
          let add_sort_alphebatically_z_to_a_only = " ORDER BY username DESC";

          request_full_time =
            request_full_time + add_sort_alphebatically_z_to_a_only;
        } else if (sort_by == "price low to high") {
          let add_sort_price_low_to_high_only =
            " ORDER BY current_daily_price ASC";

          request_full_time =
            request_full_time + add_sort_price_low_to_high_only;
        } else if (sort_by == "price high to low") {
          let add_sort_price_high_to_low_only =
            " ORDER BY current_daily_price DESC";

          request_full_time =
            request_full_time + add_sort_price_high_to_low_only;
        }
      }
    }

    try {
      await client.query(request_full_time).then((resp) => {
        let arr = [];
        let len = resp.rows.length;
        for (var i = 0; i < len; i++) {
          let result = resp.rows[i];
          arr.push(result);
        }
        caretakerObject.fullTime = arr;
        res.send(JSON.stringify(caretakerObject));
      });
    } catch (err) {
      console.error(err.stack);
    }
  } else if (commitment == "part-time") {
    let request_part_time =
      "SELECT username FROM part_time_caretaker" +
      " NATURAL JOIN can_take_care NATURAL JOIN availabilities NATURAL JOIN daily_price_rate" +
      " WHERE";

    if (date_from != null && date_to != null) {
      let add_dates_requested =
        " (start <= date('" +
        date_from +
        "') AND end >= date('" +
        date_to +
        "'))";

      request_part_time = request_part_time + add_dates_requested + " AND";
    }

    if (rating_wanted != null) {
      let add_rating_requested =
        " (rating >= " + parseFloat(rating_wanted) + ")";

      request_part_time = request_part_time + add_rating_requested + " AND";
    }

    if (type_of_animal != null) {
      type_of_animal = type_of_animal.replace(/,/g, "' OR type_name = '");
      let add_animal_type_requested = " (type_name = '" + type_of_animal + "')";

      request_part_time =
        request_part_time + add_animal_type_requested + " AND";
    }

    if (price_range_from != null && price_range_to == null) {
      let add_min_price =
        " (current_daily_price >= " + parseFloat(price_range_from) + ")";

      request_part_time = request_part_time + add_min_price + " AND";
    } else if (price_range_from == null && price_range_to != null) {
      let add_max_price =
        " (current_daily_price <= " + parseFloat(price_range_to) + ")";

      request_part_time = request_part_time + add_max_price + " AND";
    } else if (price_range_from != null && price_range_to != null) {
      let add_price_range =
        " (current_daily_price BETWEEN " +
        parseFloat(price_range_from) +
        " AND " +
        parseFloat(price_range_to) +
        ")";

      request_part_time = request_part_time + add_price_range + " AND";
    }

    let request_part_time_split_by_space = request_part_time.trim().split(" ");
    if (
      request_part_time_split_by_space[
        request_part_time_split_by_space.length - 1
      ] == "AND" ||
      request_part_time_split_by_space[
        request_part_time_split_by_space.length - 1
      ] == "WHERE"
    ) {
      request_part_time = request_part_time_split_by_space
        .slice(0, -1)
        .join(" ");
    } else {
      request_part_time = request_part_time_split_by_space.join(" ");
    }

    if (sort_by != null) {
      if (sort_by.length > 1) {
        if (sort_by[0] == "alphabetical a to z") {
          let add_sort_alphebatically_a_to_z = " ORDER BY username ASC,";

          request_part_time =
            request_part_time + add_sort_alphebatically_a_to_z;
        } else if (sort_by[0] == "alphabetical z to a") {
          let add_sort_alphebatically_z_to_a = " ORDER BY username DESC,";

          request_part_time =
            request_part_time + add_sort_alphebatically_z_to_a;
        }

        if (sort_by[1] == "price low to high") {
          let add_sort_price_low_to_high = " current_daily_price ASC";

          request_part_time = request_part_time + add_sort_price_low_to_high;
        } else if (sort_by[1] == "price high to low") {
          let add_sort_price_high_to_low = " current_daily_price DESC";

          request_part_time = request_part_time + add_sort_price_high_to_low;
        }
      } else {
        if (sort_by == "alphabetical a to z") {
          let add_sort_alphebatically_a_to_z_only = " ORDER BY username ASC";

          request_part_time =
            request_part_time + add_sort_alphebatically_a_to_z_only;
        } else if (sort_by == "alphabetical z to a") {
          let add_sort_alphebatically_z_to_a_only = " ORDER BY username DESC";

          request_part_time =
            request_part_time + add_sort_alphebatically_z_to_a_only;
        } else if (sort_by == "price low to high") {
          let add_sort_price_low_to_high_only =
            " ORDER BY current_daily_price ASC";

          request_part_time =
            request_part_time + add_sort_price_low_to_high_only;
        } else if (sort_by == "price high to low") {
          let add_sort_price_high_to_low_only =
            " ORDER BY current_daily_price DESC";

          request_part_time =
            request_part_time + add_sort_price_high_to_low_only;
        }
      }
    }

    try {
      await client.query(request_part_time).then((resp) => {
        let arr = [];
        let len = resp.rows.length;
        for (var i = 0; i < len; i++) {
          let result = resp.rows[i];
          arr.push(result);
        }
        caretakerObject.partTime = arr;
        res.send(JSON.stringify(caretakerObject));
      });
    } catch (err) {
      console.error(err.stack);
    }
  } else {
    // both full-time and part-time
    let request_full_time =
      "SELECT username FROM full_time_caretaker" +
      " NATURAL JOIN can_take_care NATURAL JOIN leave_days NATURAL JOIN daily_price_rate" +
      " WHERE";

    let request_part_time =
      "SELECT username FROM part_time_caretaker" +
      " NATURAL JOIN can_take_care NATURAL JOIN availabilities NATURAL JOIN daily_price_rate" +
      " WHERE";

    if (date_from != null && date_to != null) {
      let add_dates_requested_full_time =
        " (from NOT BETWEEN date('" +
        date_from +
        "') AND date('" +
        date_to +
        "') AND to NOT BETWEEN date('" +
        date_from +
        "') AND date('" +
        date_to +
        "')) OR (from BETWEEN date('" +
        date_from +
        "') AND date('" +
        date_to +
        "') AND to NOT BETWEEN date('" +
        date_from +
        "') AND date('" +
        date_to +
        "') AND isApproved = false)";

      let add_dates_requested_part_time =
        " (start <= date('" +
        date_from +
        "') AND end >= date('" +
        date_to +
        "'))";

      request_full_time =
        request_full_time + add_dates_requested_full_time + " AND";

      request_part_time =
        request_part_time + add_dates_requested_part_time + " AND";
    }

    if (rating_wanted != null) {
      let add_rating_requested =
        " (rating >= " + parseFloat(rating_wanted) + ")";

      request_full_time = request_full_time + add_rating_requested + " AND";
      request_part_time = request_part_time + add_rating_requested + " AND";
    }

    if (type_of_animal != null) {
      type_of_animal = type_of_animal.replace(/,/g, "' OR type_name = '");
      let add_animal_type_requested = " (type_name = '" + type_of_animal + "')";

      request_full_time =
        request_full_time + add_animal_type_requested + " AND";

      request_part_time =
        request_part_time + add_animal_type_requested + " AND";
    }

    if (price_range_from != null && price_range_to == null) {
      let add_min_price =
        " (current_daily_price >= " + parseFloat(price_range_from) + ")";

      request_full_time = request_full_time + add_min_price + " AND";

      request_part_time = request_part_time + add_min_price + " AND";
    } else if (price_range_from == null && price_range_to != null) {
      let add_max_price =
        " (current_daily_price <= " + parseFloat(price_range_to) + ")";

      request_full_time = request_full_time + add_max_price + " AND";

      request_part_time = request_part_time + add_max_price + " AND";
    } else if (price_range_from != null && price_range_to != null) {
      let add_price_range =
        " (current_daily_price BETWEEN " +
        parseFloat(price_range_from) +
        " AND " +
        parseFloat(price_range_to) +
        ")";

      request_full_time = request_full_time + add_price_range + " AND";

      request_part_time = request_part_time + add_price_range + " AND";
    }

    let request_full_time_split_by_space = request_full_time.trim().split(" ");

    if (
      request_full_time_split_by_space[
        request_full_time_split_by_space.length - 1
      ] == "AND" ||
      request_full_time_split_by_space[
        request_full_time_split_by_space.length - 1
      ] == "WHERE"
    ) {
      request_full_time = request_full_time_split_by_space
        .slice(0, -1)
        .join(" ");
    } else {
      request_full_time = request_full_time_split_by_space.join(" ");
    }

    let request_part_time_split_by_space = request_part_time.trim().split(" ");

    if (
      request_part_time_split_by_space[
        request_part_time_split_by_space.length - 1
      ] == "AND" ||
      request_part_time_split_by_space[
        request_part_time_split_by_space.length - 1
      ] == "WHERE"
    ) {
      request_part_time = request_part_time_split_by_space
        .slice(0, -1)
        .join(" ");
    } else {
      request_part_time = request_part_time_split_by_space.join(" ");
    }

    if (sort_by != null) {
      if (sort_by.length > 1) {
        if (sort_by[0] == "alphabetical a to z") {
          let add_sort_alphebatically_a_to_z = " ORDER BY username ASC,";

          request_full_time =
            request_full_time + add_sort_alphebatically_a_to_z;

          request_part_time =
            request_part_time + add_sort_alphebatically_a_to_z;
        } else if (sort_by[0] == "alphabetical z to a") {
          let add_sort_alphebatically_z_to_a = " ORDER BY username DESC,";

          request_full_time =
            request_full_time + add_sort_alphebatically_z_to_a;

          request_part_time =
            request_part_time + add_sort_alphebatically_z_to_a;
        }

        if (sort_by[1] == "price low to high") {
          let add_sort_price_low_to_high = " current_daily_price ASC";

          request_full_time = request_full_time + add_sort_price_low_to_high;
        } else if (sort_by[1] == "price high to low") {
          let add_sort_price_high_to_low = " current_daily_price DESC";

          request_full_time = request_full_time + add_sort_price_high_to_low;

          request_part_time = request_part_time + add_sort_price_high_to_low;
        }
      } else {
        if (sort_by == "alphabetical a to z") {
          let add_sort_alphebatically_a_to_z_only = " ORDER BY username ASC";

          request_full_time =
            request_full_time + add_sort_alphebatically_a_to_z_only;

          request_part_time =
            request_part_time + add_sort_alphebatically_a_to_z_only;
        } else if (sort_by == "alphabetical z to a") {
          let add_sort_alphebatically_z_to_a_only = " ORDER BY username DESC";

          request_full_time =
            request_full_time + add_sort_alphebatically_z_to_a_only;

          request_part_time =
            request_part_time + add_sort_alphebatically_z_to_a_only;
        } else if (sort_by == "price low to high") {
          let add_sort_price_low_to_high_only =
            " ORDER BY current_daily_price ASC";

          request_full_time =
            request_full_time + add_sort_price_low_to_high_only;

          request_part_time =
            request_part_time + add_sort_price_low_to_high_only;
        } else if (sort_by == "price high to low") {
          let add_sort_price_high_to_low_only =
            " ORDER BY current_daily_price DESC";

          request_full_time =
            request_full_time + add_sort_price_high_to_low_only;

          request_part_time =
            request_part_time + add_sort_price_high_to_low_only;
        }
      }
    }

    try {
      await client.query(request_full_time).then((resp) => {
        let full_time_arr = [];
        let full_time_len = resp.rows.length;
        for (var i = 0; i < full_time_len; i++) {
          let result = resp.rows[i];
          full_time_arr.push(result);
        }
        caretakerObject.fullTime = full_time_arr;
      });
    } catch (err) {
      console.error(err.stack);
    }

    try {
      await client.query(request_part_time).then((resp) => {
        let part_time_arr = [];
        let part_time_len = resp.rows.length;
        for (var i = 0; i < len; i++) {
          let result = resp.rows[i];
          part_time_arr.push(result);
        }
        caretakerObject.partTime = part_time_arr;
        res.send(JSON.stringify(caretakerObject));
      });
    } catch (err) {
      console.error(err.stack);
    }
  }
});

app.get("/pet-care/caretakers?username=${props.username}", async function (
  req,
  res
) {
  // https://stackoverflow.com/questions/63321982/is-there-a-way-to-send-data-from-the-frontend-to-the-server-with-an-axios-get-re
  let caretaker_details_wanted = req.query.username;
  const get_caretaker_details =
    "SELECT username, name, AGE(CURRENT_DATE, date_birth) AS age, gender, phone, email, address, " +
    "rating, AGE(CURRENT_DATE, date_started) AS years_of_exp, type_name, current_daily_price" +
    " FROM user NATURAL JOIN caretaker NATURAL JOIN can_take_care NATURAL JOIN daily_price_rate" +
    " WHERE username = '" +
    caretaker_details_wanted +
    "'";

  try {
    await client.query(get_caretaker_details).then((resp) => {
      let arr = [];
      let len = resp.rows.length;
      for (var i = 0; i < len; i++) {
        let result = resp.rows[i];
        arr.push(result);
      }
      res.send(arr);
    });
  } catch (err) {
    console.error(err.stack);
  }
});