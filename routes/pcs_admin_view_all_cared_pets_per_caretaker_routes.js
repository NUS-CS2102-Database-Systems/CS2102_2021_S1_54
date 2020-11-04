const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.get("/pcs-admin-total-cared-pets-per-caretaker", get_past_jobs_information);
};

async function get_past_jobs_information(req, res) {
  try {
    const client = await pool.connect();
    // const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT cusername, COUNT(*) FROM bid_transaction GROUP BY cusername ORDER BY COUNT(*) DESC`
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
