const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

var appRouter = function (app) { 
    app.get("/admins", get_all_admins);
    app.post("/admins", create_admin);
    app.post("/admins/authenticate", authenticate_admin);
    app.delete("/admins", delete_admin);
}

async function get_all_admins(req, res) {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM pcs_administrator;");

        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(result.rows))
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

async function authenticate_admin(req, res) {
    try {
        const client = await pool.connect();
        const username = req.body.username;
        const password = req.body.password;

        const query = `SELECT * FROM pcs_administrator WHERE username = '${username}' AND password = '${password}';`;
        const result = await client.query(query);

        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(result.rows));
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

async function create_admin(req, res) {
    try {
        const client = await pool.connect();
        const username = req.body.username;
        const password = req.body.password;

        // check existence of user
        const result = await client.query(`SELECT * FROM pcs_administrator WHERE username = '${username}'`);
        if (result.rowCount !== 0) {
            res.send("admin username already exists!");
        } else {
            const query = `INSERT INTO pcs_administrator VALUES('${username}', '${password}');`
            
            await client.query(query);
            const result = await client.query(`SELECT * FROM pcs_administrator WHERE username = '${username}';`);
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify(result.rows));
        }
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

async function delete_admin(req, res) {
    try {
        const client = await pool.connect();
        const username = req.body.username;
        const password = req.body.password;
        const delete_query = `DELETE FROM pcs_administrator WHERE username = '${username}' AND password = '${password}';`;
        await client.query(delete_query);

        res.send(`${username} is deleted!`);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

module.exports = appRouter;