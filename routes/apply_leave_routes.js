const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

var appRouter = function (app) { 
    app.get("/apply-leave", get_all_leaves_for_caretaker);
    app.post("/apply-leave", submit_leave);
}

async function get_all_leaves_for_caretaker(req, res) {
    try {
        const client = await pool.connect();
        const username = req.query.username;
        const query = ` SELECT *
            FROM leave_days
            WHERE username = '${username}';
        `;
        const result = await client.query(query);

        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(result.rows));
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }

}

async function submit_leave(req, res) {
    // format of request body:
    // {
    //      "username": "username",
    //      "reason_for_leave": "xxx",
    //      "start_date": "xxx",
    //      "end_date": "xxx",
    // }
    try {
        const client = await pool.connect();
        const username = req.body.username;
        const reason_for_leave = req.body.reason_for_leave;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const query = ` INSERT INTO leave_days
            VALUES('${username}', '${reason_for_leave}', '${start_date}', '${end_date}');
        `;
        await client.query(query);

        res.send("Leave submitted!");
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

module.exports = appRouter;