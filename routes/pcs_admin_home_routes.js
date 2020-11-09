const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.get(
    "/pcs-admin/get-num-pets-cared-for-and-amount-earned",
    get_num_pets_cared_for_and_amount_earned
  );
  //   app.post("/pcs-admin/get-amount-earned", get_amount_earned);
};

async function get_num_pets_cared_for_and_amount_earned(req, res) {
  try {
    const client = await pool.connect();
    let first_date = new Date(date.getFullYear(), date.getMonth(), 1);

    const result = await client.query(
      `SELECT COUNT(*) AS num_of_pets, SUM(amount) 
        FROM bid_transactions WHERE job_end_datetime >= '${first_date}' 
        AND job_end_datetime <= current_date;`
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

    const edit_login_info = `UPDATE pcs_administrator SET password = '${password}' 
    WHERE username = '${username}';`;

    await client.query(edit_login_info);

    const result = await client.query(
      `SELECT password FROM pcs_administrator WHERE username = '${username}';`
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
