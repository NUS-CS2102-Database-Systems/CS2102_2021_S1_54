const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.post("/pcs-admin/caretaker-details", get_caretaker_details);
};

async function get_caretaker_details(req, res) {
  try {
    const client = await pool.connect();
    const cusername = req.body.toGet.username;
    // const query = `SELECT name, birth_date, AGE(birth_date) AS age, gender, phone, email,
    //     address, AGE(date_started) AS years_exp, date_started, average_rating
    //     FROM users NATURAL JOIN caretaker WHERE username = '${cusername}';`;
    const query = `SELECT name, birth_date, AGE(birth_date) AS age, gender, phone, email, 
        address, AGE(date_started) AS years_exp, date_started, average_rating, 
        CASE 
            WHEN (SELECT EXISTS (SELECT 1 FROM full_time_caretaker WHERE username = '${cusername}')) = 't' 
            THEN 5 
            WHEN ((SELECT EXISTS (SELECT 1 FROM part_time_caretaker WHERE username = '${cusername}')) = 't') 
            AND (SELECT COUNT(*) FROM availabilities WHERE username = '${cusername}') > 0
            THEN (SELECT number_of_pets_allowed 
              FROM availabilities WHERE username = '${cusername}' 
              ORDER BY start_date DESC, end_date DESC LIMIT 1)
            ELSE 2 END AS num_pets_allowed 
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
