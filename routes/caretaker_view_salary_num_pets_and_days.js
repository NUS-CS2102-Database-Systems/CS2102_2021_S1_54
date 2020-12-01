const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.post("/caretakers/get-num-bid-transactions", num_bid_transactions);
  app.post("/caretakers/get-num-pet-days", get_num_pet_days);
  app.post("/full-time-caretakers/get-salary", get_fulltime_salary);
  app.post("/part-time-caretakers/get-salary", get_parttime_salary);
  app.post("/caretakers/home-current-event", get_current_event_information);
  app.post("/caretakers/home-upcoming-event", get_upcoming_event_information);
};

async function num_bid_transactions(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;
    const startMonth = req.body.toGet.startMonth;
    const moment_datetime = req.body.toGet.moment_datetime;
    //const tomorrow_datetime = req.body.toGet.tomorrow_datetime;
    //const endMonth = req.body.toGet.endMonth;

    const result = await client.query(
      `SELECT COUNT(*) as num_pets
      FROM bid_transaction
      WHERE cusername = '${username}' AND job_end_datetime >= '${startMonth}' AND job_end_datetime < '${moment_datetime}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_num_pet_days(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT pet_days 
      FROM pet_days_past_30_days 
      WHERE cusername = '${username}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_fulltime_salary(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT salary 
      FROM salary_calculation_for_full_time 
      WHERE cusername = '${username}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_parttime_salary(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT salary 
      FROM salary_calculation_for_part_time 
      WHERE cusername = '${username}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_current_event_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;
    const moment_datetime = req.body.toGet.moment_datetime;
    const tomorrow_datetime = req.body.toGet.tomorrow_datetime;

    const result = await client.query(
      `SELECT pet_name, pusername, job_start_datetime, job_end_datetime, start_transfer_method, end_transfer_method, payment_method, amount
      FROM bid_transaction 
      WHERE cusername = '${username}' AND job_start_datetime < '${tomorrow_datetime}' AND job_end_datetime >= '${moment_datetime}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_upcoming_event_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;
    //const current_datetime = req.body.toGet.current_datetime;
    const tomorrow_datetime = req.body.toGet.tomorrow_datetime;

    const result = await client.query(
      `SELECT pet_name, pusername, job_start_datetime, job_end_datetime, start_transfer_method, end_transfer_method
        FROM bid_transaction 
        WHERE cusername = '${username}' AND job_start_datetime >= '${tomorrow_datetime}'; `
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
