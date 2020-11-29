const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.get("/pcs-admin/caretaker-details", get_caretaker_details);
};

async function get_caretaker_details(req, res) {
  const cusername = req.body.toGet.username;
  try {
    const client = await pool.connect();
    const cusername = req.params.cusername;
    const query = `SELECT name, birth_date, AGE(birth_date) AS age, gender, phone, email, 
        address, AGE(date_started) AS years_exp, date_started, average_rating, 
        CASE 
            WHEN (SELECT EXISTS (SELECT 1 FROM full_time_caretaker WHERE username = '${cusername}')) = 't' 
            THEN 5 
            ELSE (SELECT number_of_pets_allowed 
                FROM availabilities WHERE username = '${cusername}' 
                ORDER BY start_date DESC, end_date DESC LIMIT 1) AS num_pets_allowed
        FROM users NATURAL JOIN caretaker WHERE username = '${cusername}';`;

    const result = await client.query(query);

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

module.exports = appRouter;
