const { query } = require("express");
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.get("/pet-owners/get-caretakers-information", get_caretakers_information);
  app.post(
    "/pet-owners/get-caretaker-pets-information",
    get_caretaker_pets_information
  );
  app.post(
    "/pet-owners/get-specific-caretakers-information",
    get_specific_caretakers_information
  );
};

async function get_caretakers_information(req, res) {
  try {
    const client = await pool.connect();

    const result = await client.query(
      `SELECT username, name, AGE(birth_date) AS age, birth_date, gender, phone, email, address, 
      average_rating, AGE(date_started) AS years_exp FROM users NATURAL JOIN caretaker 
      ORDER BY random() LIMIT 20;`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_caretaker_pets_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT type_name, current_daily_price FROM can_take_care NATURAL JOIN daily_price_rate 
      WHERE username = '${username}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_specific_caretakers_information(req, res) {
  try {
    const client = await pool.connect();
    let commitment = req.body.caretaker.commitment;
    const dates_received = req.body.caretaker.dates;
    let rating_wanted = req.body.caretaker.rating;
    let sort_by = req.body.caretaker.order_by;
    let price_range_from = req.body.caretaker.start_price;
    let price_range_to = req.body.caretaker.end_price;
    let type_of_animal = req.body.caretaker.animal_type;
    let caretaker_username = req.body.caretaker.search_caretaker;
    let date_from = "";
    let date_to = "";
    let query = "";

    if (dates_received != null) {
      let dates = dates_received.split(",");
      date_from = dates[0];
      date_to = dates[1];
    } else {
      date_from = null;
      date_to = null;
    }

    // var caretakerObject = { fullTime: {}, partTime: {} };

    if (commitment == "full-time") {
      let request_full_time = `SELECT username, name, AGE(birth_date) AS age, birth_date, gender, 
      phone, email, address, average_rating, AGE(date_started) AS years_exp FROM users NATURAL JOIN 
      caretaker NATURAL JOIN full_time_caretaker NATURAL JOIN can_take_care NATURAL JOIN leave_days 
      NATURAL JOIN daily_price_rate WHERE`;

      if (caretaker_username != null) {
        request_full_time =
          request_full_time + ` username LIKE '${caretaker_username}' AND`;
      }

      if (date_from != null && date_to != null) {
        let add_dates_requested = ` (start_date NOT BETWEEN date('${date_from}') AND 
        date('${date_to}') AND end_date NOT BETWEEN date('${date_from}') AND 
        date('${date_to}'))`;

        request_full_time = request_full_time + add_dates_requested + " AND";
      }

      if (rating_wanted != null) {
        let add_rating_requested =
          " (average_rating >= " + parseFloat(rating_wanted).toString() + ")";

        request_full_time = request_full_time + add_rating_requested + " AND";
      }

      if (type_of_animal != null) {
        type_of_animal = type_of_animal.replace(/,/g, "' OR type_name = '");
        let add_animal_type_requested =
          " (type_name = '" + type_of_animal + "')";

        request_full_time =
          request_full_time + add_animal_type_requested + " AND";
      }

      if (price_range_from != null && price_range_to == null) {
        let add_min_price =
          " (current_daily_price >= " +
          parseFloat(price_range_from).toString() +
          ")";

        request_full_time = request_full_time + add_min_price + " AND";
      } else if (price_range_from == null && price_range_to != null) {
        let add_max_price =
          " (current_daily_price <= " +
          parseFloat(price_range_to).toString() +
          ")";

        request_full_time = request_full_time + add_max_price + " AND";
      } else if (price_range_from != null && price_range_to != null) {
        let add_price_range =
          " (current_daily_price BETWEEN " +
          parseFloat(price_range_from).toString() +
          " AND " +
          parseFloat(price_range_to).toString() +
          ")";

        request_full_time = request_full_time + add_price_range + " AND";
      }

      let request_full_time_split_by_space = request_full_time
        .trim()
        .split(" ");
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

      request_full_time += " ORDER BY random(),";

      if (sort_by != null) {
        if (sort_by.length > 1) {
          if (sort_by[0] == "alphabetical a to z") {
            let add_sort_alphebatically_a_to_z = " username ASC,";

            request_full_time =
              request_full_time + add_sort_alphebatically_a_to_z;
          } else if (sort_by[0] == "alphabetical z to a") {
            let add_sort_alphebatically_z_to_a = " username DESC,";

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
            let add_sort_alphebatically_a_to_z_only = " username ASC";

            request_full_time =
              request_full_time + add_sort_alphebatically_a_to_z_only;
          } else if (sort_by == "alphabetical z to a") {
            let add_sort_alphebatically_z_to_a_only = " username DESC";

            request_full_time =
              request_full_time + add_sort_alphebatically_z_to_a_only;
          } else if (sort_by == "price low to high") {
            let add_sort_price_low_to_high_only = " current_daily_price ASC";

            request_full_time =
              request_full_time + add_sort_price_low_to_high_only;
          } else if (sort_by == "price high to low") {
            let add_sort_price_high_to_low_only = " current_daily_price DESC";

            request_full_time =
              request_full_time + add_sort_price_high_to_low_only;
          }
        }
      }

      let req_len = request_full_time.length;
      if (request_full_time.charAt(req_len - 1) == ",") {
        request_full_time = request_full_time.slice(0, -1);
      }

      request_full_time += " LIMIT 20;";

      const result = await client.query(request_full_time);

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify(result.rows));
      client.release();
    } else if (commitment == "part-time") {
      let request_part_time = `SELECT username, name, AGE(birth_date) AS age, birth_date, gender, 
      phone, email, address, average_rating, AGE(date_started) AS years_exp FROM users NATURAL JOIN
      caretaker NATURAL JOIN part_time_caretaker NATURAL JOIN can_take_care 
      NATURAL JOIN availabilities NATURAL JOIN daily_price_rate WHERE`;

      if (caretaker_username != null) {
        request_full_time =
          request_full_time + ` username LIKE '${caretaker_username}' AND`;
      }

      if (date_from != null && date_to != null) {
        let add_dates_requested =
          " (start_date <= date('" +
          date_from +
          "') AND end_date >= date('" +
          date_to +
          "'))";

        request_part_time = request_part_time + add_dates_requested + " AND";
      }

      if (rating_wanted != null) {
        let add_rating_requested =
          " (average_rating >= " + parseFloat(rating_wanted).toString() + ")";

        request_part_time = request_part_time + add_rating_requested + " AND";
      }

      if (type_of_animal != null) {
        type_of_animal = type_of_animal.replace(/,/g, "' OR type_name = '");
        let add_animal_type_requested =
          " (type_name = '" + type_of_animal + "')";

        request_part_time =
          request_part_time + add_animal_type_requested + " AND";
      }

      if (price_range_from != null && price_range_to == null) {
        let add_min_price =
          " (current_daily_price >= " +
          parseFloat(price_range_from).toString() +
          ")";

        request_part_time = request_part_time + add_min_price + " AND";
      } else if (price_range_from == null && price_range_to != null) {
        let add_max_price =
          " (current_daily_price <= " +
          parseFloat(price_range_to).toString() +
          ")";

        request_part_time = request_part_time + add_max_price + " AND";
      } else if (price_range_from != null && price_range_to != null) {
        let add_price_range =
          " (current_daily_price BETWEEN " +
          parseFloat(price_range_from).toString() +
          " AND " +
          parseFloat(price_range_to).toString() +
          ")";

        request_part_time = request_part_time + add_price_range + " AND";
      }

      let request_part_time_split_by_space = request_part_time
        .trim()
        .split(" ");
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

      request_part_time += " ORDER BY random(),";

      if (sort_by != null) {
        if (sort_by.length > 1) {
          if (sort_by[0] == "alphabetical a to z") {
            let add_sort_alphebatically_a_to_z = " username ASC,";

            request_part_time =
              request_part_time + add_sort_alphebatically_a_to_z;
          } else if (sort_by[0] == "alphabetical z to a") {
            let add_sort_alphebatically_z_to_a = " username DESC,";

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
            let add_sort_alphebatically_a_to_z_only = " username ASC";

            request_part_time =
              request_part_time + add_sort_alphebatically_a_to_z_only;
          } else if (sort_by == "alphabetical z to a") {
            let add_sort_alphebatically_z_to_a_only = " username DESC";

            request_part_time =
              request_part_time + add_sort_alphebatically_z_to_a_only;
          } else if (sort_by == "price low to high") {
            let add_sort_price_low_to_high_only = " current_daily_price ASC";

            request_part_time =
              request_part_time + add_sort_price_low_to_high_only;
          } else if (sort_by == "price high to low") {
            let add_sort_price_high_to_low_only = " current_daily_price DESC";

            request_part_time =
              request_part_time + add_sort_price_high_to_low_only;
          }
        }
      }

      let req_len = request_part_time.length;
      if (request_part_time.charAt(req_len - 1) == ",") {
        request_part_time = request_part_time.slice(0, -1);
      }

      request_part_time += " LIMIT 20;";

      const result = await client.query(request_part_time);

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify(result.rows));
      client.release();
    } else {
      if (
        commitment == null &&
        dates_received == null &&
        rating_wanted == null &&
        sort_by == null &&
        price_range_from == null &&
        price_range_to == null &&
        type_of_animal == null &&
        caretaker_username == null
      ) {
        query = `SELECT username, name, AGE(birth_date) AS age, birth_date, gender, phone, email, address, 
          average_rating, AGE(date_started) AS years_exp FROM users NATURAL JOIN caretaker 
          ORDER BY random() LIMIT 20;`;
      } else {
        // both full-time and part-time
        let general_query = `SELECT X.username AS username, X.name AS name, X.age AS age, X.birth_date AS birth_date, X.gender AS gender, 
        X.phone AS phone, X.email AS email, X.address AS address, X.average_rating AS average_rating, X.years_exp AS years_exp FROM (`;

        let request_full_time = `SELECT username, name, AGE(birth_date) AS age, birth_date, gender, 
      phone, email, address, average_rating, AGE(date_started) AS years_exp FROM users NATURAL JOIN 
      caretaker NATURAL JOIN full_time_caretaker NATURAL JOIN can_take_care NATURAL JOIN leave_days 
      NATURAL JOIN daily_price_rate WHERE`;

        let request_part_time = `SELECT username, name, AGE(birth_date) AS age, birth_date, gender, 
      phone, email, address, average_rating, AGE(date_started) AS years_exp FROM users NATURAL JOIN 
      caretaker NATURAL JOIN part_time_caretaker NATURAL JOIN can_take_care 
      NATURAL JOIN availabilities NATURAL JOIN daily_price_rate WHERE`;

        if (caretaker_username != null) {
          request_full_time =
            request_full_time + ` username LIKE '${caretaker_username}' AND`;

          request_part_time =
            request_part_time + ` username LIKE '${caretaker_username}' AND`;
        }

        if (date_from != null && date_to != null) {
          let add_dates_requested_full_time = ` (start_date NOT BETWEEN date('${date_from}') AND 
        date('${date_to}') AND end_date NOT BETWEEN date('${date_from}') AND 
        date('${date_to}'))`;

          let add_dates_requested_part_time =
            " (start_date <= date('" +
            date_from +
            "') AND end_date >= date('" +
            date_to +
            "'))";

          request_full_time =
            request_full_time + add_dates_requested_full_time + " AND";

          request_part_time =
            request_part_time + add_dates_requested_part_time + " AND";
        }

        if (rating_wanted != null) {
          let add_rating_requested =
            " (average_rating >= " + parseFloat(rating_wanted).toString() + ")";

          request_full_time = request_full_time + add_rating_requested + " AND";
          request_part_time = request_part_time + add_rating_requested + " AND";
        }

        if (type_of_animal != null) {
          type_of_animal = type_of_animal.replace(/,/g, "' OR type_name = '");
          let add_animal_type_requested =
            " (type_name = '" + type_of_animal + "')";

          request_full_time =
            request_full_time + add_animal_type_requested + " AND";

          request_part_time =
            request_part_time + add_animal_type_requested + " AND";
        }

        if (price_range_from != null && price_range_to == null) {
          let add_min_price =
            " (current_daily_price >= " +
            parseFloat(price_range_from).toString() +
            ")";

          request_full_time = request_full_time + add_min_price + " AND";

          request_part_time = request_part_time + add_min_price + " AND";
        } else if (price_range_from == null && price_range_to != null) {
          let add_max_price =
            " (current_daily_price <= " +
            parseFloat(price_range_to).toString() +
            ")";

          request_full_time = request_full_time + add_max_price + " AND";

          request_part_time = request_part_time + add_max_price + " AND";
        } else if (price_range_from != null && price_range_to != null) {
          let add_price_range =
            " (current_daily_price BETWEEN " +
            parseFloat(price_range_from).toString() +
            " AND " +
            parseFloat(price_range_to).toString() +
            ")";

          request_full_time = request_full_time + add_price_range + " AND";

          request_part_time = request_part_time + add_price_range + " AND";
        }

        let request_full_time_split_by_space = request_full_time
          .trim()
          .split(" ");

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

        let request_part_time_split_by_space = request_part_time
          .trim()
          .split(" ");

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

        general_query +=
          request_full_time +
          " WHERE random() < 0.1" +
          " UNION " +
          request_part_time +
          " WHERE random() < 0.1) AS X";

        if (sort_by != null) {
          if (sort_by.length > 1) {
            if (sort_by[0] == "alphabetical a to z") {
              let add_sort_alphebatically_a_to_z = " ORDER BY X.username ASC,";

              general_query += add_sort_alphebatically_a_to_z;
            } else if (sort_by[0] == "alphabetical z to a") {
              let add_sort_alphebatically_z_to_a = " ORDER BY X.username DESC,";

              general_query += add_sort_alphebatically_z_to_a;
            }

            if (sort_by[1] == "price low to high") {
              let add_sort_price_low_to_high = " X.current_daily_price ASC";

              general_query += add_sort_price_low_to_high;
            } else if (sort_by[1] == "price high to low") {
              let add_sort_price_high_to_low = " X.current_daily_price DESC";

              general_query += add_sort_price_high_to_low;
            }
          } else {
            if (sort_by == "alphabetical a to z") {
              let add_sort_alphebatically_a_to_z_only =
                " ORDER BY X.username ASC";

              general_query += add_sort_alphebatically_a_to_z_only;
            } else if (sort_by == "alphabetical z to a") {
              let add_sort_alphebatically_z_to_a_only =
                " ORDER BY X.username DESC";

              general_query += add_sort_alphebatically_z_to_a_only;
            } else if (sort_by == "price low to high") {
              let add_sort_price_low_to_high_only =
                " ORDER BY X.current_daily_price ASC";

              general_query += add_sort_price_low_to_high_only;
            } else if (sort_by == "price high to low") {
              let add_sort_price_high_to_low_only =
                " ORDER BY X.current_daily_price DESC";

              general_query += add_sort_price_high_to_low_only;
            }
          }
        }

        // i.e. no other sort by specifications
        if (general_query.charAt(general_query.length - 1) == ",") {
          general_query = general_query.slice(0, -1);
        }

        general_query += ` LIMIT 20;`;

        query = general_query;
      }

      const result = await client.query(query);

      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify(result.rows));
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

module.exports = appRouter;
