const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

var appRouter = function (app) { 
    app.get("/admins/base-daily-prices", getBaseDailyPrices);
    app.post("/admins/base-daily-prices", setBaseDailyPrices);
}

async function getBaseDailyPrices(req, res) {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM set_base_daily_price;");

        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(result.rows))
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

async function setBaseDailyPrices(req, res) {
    const type_name = req.body.type_name;
    const base_daily_price = req.body.base_daily_price;
    const admin_username = req.body.admin_username;

    try {
        const client = await pool.connect();
        const query = `
            UPDATE set_base_daily_price SET base_daily_price = ${base_daily_price},
                admin_username = '${admin_username}'
                WHERE type_name = '${type_name}' 
                    AND EXISTS (SELECT * FROM pcs_administrator WHERE username = '${admin_username}');
        `;
        await client.query(query);

        res.send("Base daily prices updated successfully.");
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

module.exports = appRouter;