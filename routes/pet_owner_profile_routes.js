const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.post("/pet-owners/get-profile-information", get_profile_information);
  app.post(
    "/pet-owners/delete-credit-card-information",
    delete_credit_card_information
  );
  app.post(
    "/pet-owners/add-credit-card-information",
    add_credit_card_information
  );
  app.post(
    "/pet-owners/get-credit-card-information",
    get_credit_card_information
  );
  app.post(
    "/pet-owners/edit-credit-card-information",
    edit_credit_card_information
  );
  app.post("/pet-owners/get-login-information", get_login_information);
  app.post("/pet-owners/edit-login-information", edit_login_information);
  app.post("/pet-owners/get-personal-information", get_personal_information);
  app.post("/pet-owners/edit-personal-information", edit_personal_information);
};

async function get_profile_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT password, name, birth_date, AGE(current_date, birth_date) AS age, gender, phone, email, 
      address, credit_card_number, credit_card_full_name, credit_card_expiry_date 
      FROM users NATURAL JOIN pet_owner WHERE username = '${username}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function delete_credit_card_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toDelete.username;

    const query = `UPDATE pet_owner SET credit_card_number = NULL, credit_card_full_name = NULL, 
    credit_card_expiry_date = NULL WHERE username = '${username}';`;

    await client.query(query);

    const result = await client.query(
      `SELECT * FROM pet_owner WHERE username = '${username}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function add_credit_card_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.addCreditCardInfo.username;
    const credit_card_num = req.body.addCreditCardInfo.card_number;
    const credit_card_name = req.body.addCreditCardInfo.card_name;
    const credit_card_exp_date = req.body.addCreditCardInfo.expiry_date;

    const insert_card_details = `UPDATE pet_owner SET credit_card_number = '${credit_card_num}', 
    credit_card_full_name = '${credit_card_name}', 
    credit_card_expiry_date = '${credit_card_exp_date}' WHERE username = '${username}';`;

    await client.query(insert_card_details);

    const result = await client.query(
      `SELECT * FROM pet_owner WHERE username = '${username}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_credit_card_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT * FROM pet_owner WHERE username = '${username}';`
    );
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function edit_credit_card_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toEdit.username;
    const credit_card_num = req.body.toEdit.card_number;
    const credit_card_name = req.body.toEdit.card_name;
    const credit_card_exp_date = req.body.toEdit.expiry_date;

    const edit_card_details = `UPDATE pet_owner SET credit_card_number = '${credit_card_num}', 
    credit_card_full_name = '${credit_card_name}', 
    credit_card_expiry_date = '${credit_card_exp_date}' WHERE username = '${username}';`;

    await client.query(edit_card_details);

    const result = await client.query(
      `SELECT * FROM pet_owner WHERE username = '${username}';`
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
      `SELECT name, birth_date, AGE(current_date, birth_date), gender, phone, email, address 
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
