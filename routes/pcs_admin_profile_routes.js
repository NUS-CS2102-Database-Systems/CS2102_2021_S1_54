const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.post("/pcs-admin/get-login-information", get_login_information);
  app.post("/pcs-admin/edit-login-information", edit_login_information);
};

async function get_login_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT password 
        FROM pcs_administrator WHERE username = '${username}';`
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
