const { query } = require("express");
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.post(
    "/part-time-caretakers/get-availabilities-information",
    get_availabilities_information
  );
  app.post(
    "/part-time-caretakers/get-num-of-pets-information",
    get_num_of_pets_information
  );
  app.post(
    "/part-time-caretakers/add-availabilities-information",
    add_availabilities_information
  );
  app.post(
    "/part-time-caretakers/edit-availabilities-information",
    edit_availabilities_information
  );
};

async function get_availabilities_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;
    let date = new Date();
    let curr_year = date.getFullYear();
    let next_year = date.getFullYear() + 1;

    const result = await client.query(
      `SELECT start_date, end_date, number_of_pets_allowed 
      FROM availabilities 
      WHERE username = '${username}' AND 
      ((SELECT EXTRACT(YEAR FROM start_date) = '${curr_year}') OR 
      (SELECT EXTRACT(YEAR FROM start_date) = '${next_year}')) 
      AND ((SELECT EXTRACT(YEAR FROM end_date) = '${curr_year}') OR 
      (SELECT EXTRACT(YEAR FROM end_date) = '${next_year}'))  
      ORDER BY start_date ASC, end_date ASC;`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_num_of_pets_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT number_of_pets_allowed 
        FROM availabilities 
        WHERE username = '${username}' 
        ORDER BY start_date DESC, end_date DESC LIMIT 1;`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function add_availabilities_information(req, res) {
  try {
    const client = await pool.connect();
    let username = "";
    // let query = "INSERT INTO availabilities VALUES";
    let date = new Date();
    let curr_year = date.getFullYear();
    let next_year = date.getFullYear() + 1;

    for (let i = 0; i < req.body.toEdit.length; i++) {
      username = req.body.toEdit[i].caretaker_username;
      let start_date = req.body.toEdit[i].start_date;
      let end_date = req.body.toEdit[i].end_date;
      let num_of_pets = req.body.toEdit[i].num_pets;

      let query = `INSERT INTO availabilities VALUES ('${username}', '${start_date}', '${end_date}', ${num_of_pets});`;

      await client.query(query);
    }

    // query = query.slice(0, -1);
    // query += ";";

    // await client.query(query);

    const result = await client.query(
      `SELECT COUNT(*) AS num
      FROM availabilities 
      WHERE username = '${username}' AND 
      ((SELECT EXTRACT(YEAR FROM start_date) = '${curr_year}') OR 
      (SELECT EXTRACT(YEAR FROM start_date) = '${next_year}')) 
      AND ((SELECT EXTRACT(YEAR FROM end_date) = '${curr_year}') OR 
      (SELECT EXTRACT(YEAR FROM end_date) = '${next_year}'));`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function edit_availabilities_information(req, res) {
  try {
    const client = await pool.connect();
    // let query = "INSERT INTO availabilities VALUES";
    let username = req.body.toEdit[0].caretaker_username;
    let date = new Date();
    let curr_year = date.getFullYear();
    let next_year = date.getFullYear() + 1;

    await client.query(
      `DELETE FROM availabilities 
      WHERE username = '${username}' AND 
      ((SELECT EXTRACT(YEAR FROM start_date) = '${curr_year}') OR 
      (SELECT EXTRACT(YEAR FROM start_date) = '${next_year}')) 
      AND ((SELECT EXTRACT(YEAR FROM end_date) = '${curr_year}') OR 
      (SELECT EXTRACT(YEAR FROM end_date) = '${next_year}'));`
    );

    for (let i = 0; i < req.body.toEdit.length; i++) {
      username = req.body.toEdit[i].caretaker_username;
      let start_date = req.body.toEdit[i].start_date;
      let end_date = req.body.toEdit[i].end_date;
      let num_of_pets = req.body.toEdit[i].num_pets;

      let query = `INSERT INTO availabilities VALUES ('${username}', '${start_date}', '${end_date}', ${num_of_pets});`;

      await client.query(query);
    }

    // query = query.slice(0, -1);
    // query += ";";

    // await client.query(query);

    // for (let i = 0; i < req.body.toEdit.length; i++) {
    //   let username = req.body.toEdit[i].caretaker_username;
    //   let start_date = req.body.toEdit[i].start_date;
    //   let end_date = req.body.toEdit[i].end_date;
    //   let num_of_pets = req.body.toEdit[i].num_pets;

    //   let query = `INSERT INTO availabilities VALUES
    //   ('${username}', '${start_date}', '${end_date}', ${num_of_pets});`;

    //   await client.query(query);
    // }

    const result = await client.query(
      `SELECT COUNT(*) FROM availabilities 
      WHERE username = '${username}' AND 
      ((SELECT EXTRACT(YEAR FROM start_date) = '${curr_year}') OR 
      (SELECT EXTRACT(YEAR FROM start_date) = '${next_year}')) 
      AND ((SELECT EXTRACT(YEAR FROM end_date) = '${curr_year}') OR 
      (SELECT EXTRACT(YEAR FROM end_date) = '${next_year}'));`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

module.exports = appRouter;
