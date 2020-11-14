const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.post("/caretakers/get-num-pet-days", get_num_pet_days);
};

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

module.exports = appRouter;
