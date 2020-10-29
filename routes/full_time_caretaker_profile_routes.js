const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.post(
    "/full-time-caretakers/get-profile-information",
    get_profile_information
  );
  app.post(
    "/full-time-caretakers/get-pets-take-care-information",
    can_take_care_of
  );
  app.post(
    "/full-time-caretakers/get-login-information",
    get_login_information
  );
  app.post(
    "/full-time-caretakers/edit-login-information",
    edit_login_information
  );
  app.post(
    "/full-time-caretakers/get-personal-information",
    get_personal_information
  );
  app.post(
    "/full-time-caretakers/edit-personal-information",
    edit_personal_information
  );
};

async function get_profile_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT password, name, birth_date, AGE(birth_date) AS age, gender, phone, email, 
      address, AGE(date_started) AS years_exp, date_started, average_rating 
      FROM users NATURAL JOIN caretaker WHERE username = '${username}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function can_take_care_of(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT type_name, current_daily_price
        FROM daily_price_rate WHERE username = '${username}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_login_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT password FROM users WHERE username = '${username}';`
    );
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function edit_login_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toEdit.username;
    const password = req.body.toEdit.password;

    const edit_login_info = `UPDATE users SET password = '${password}' 
    WHERE username = '${username}';`;

    await client.query(edit_login_info);

    const result = await client.query(
      `SELECT password FROM users WHERE username = '${username}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_personal_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT name, birth_date, AGE(birth_date) AS age, gender, phone, email, address 
      FROM users WHERE username = '${username}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function edit_personal_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toEdit.username;
    const name = req.body.toEdit.name;
    const gender = req.body.toEdit.gender;
    const phone = req.body.toEdit.phone;
    const email = req.body.toEdit.email;
    const address = req.body.toEdit.address;

    const update_query = `UPDATE users SET name = '${name}', gender = '${gender}', 
    phone = '${phone}', email = '${email}', address = '${address}' WHERE username = '${username}'`;

    await client.query(update_query);

    const result = await client.query(
      `SELECT * FROM users WHERE username = '${username}';`
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
