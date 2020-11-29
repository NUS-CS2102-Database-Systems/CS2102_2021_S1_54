const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.post("/pet-owners/home-current-event", get_current_event_information);
  app.post("/pet-owners/home-upcoming-event", get_upcoming_event_information);
};

async function get_current_event_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;
    const current_datetime = req.body.toGet.current_datetime;
    const tomorrow_datetime = req.body.toGet.tomorrow_datetime;

    const result = await client.query(
      `SELECT pet_name, cusername, job_start_datetime, job_end_datetime, start_transfer_method, end_transfer_method
      FROM bid_transaction 
      WHERE pusername == '${username}' AND job_start_datetime < '${tomorrow_datetime}' AND job_end_datetime >= '${current_datetime}'`
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
      `SELECT pet_name, cusername, job_start_datetime, job_end_datetime, start_transfer_method, end_transfer_method
        FROM bid_transaction 
        WHERE pusername == '${username}' AND job_start_datetime > '${tomorrow_datetime}' `
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
