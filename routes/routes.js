const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

var appRouter = function (app) {
    app.get("/", function (req, res) {
        res.send("Hello World!");
    });
    
    app.get("/db", example_function);
}

async function example_function(req, res) {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM test_table");
        const results = { results: result ? result.rows : null };

        res.send(JSON.stringify(results));
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

module.exports = appRouter;