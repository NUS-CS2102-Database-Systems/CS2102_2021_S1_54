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
    app.delete("/apply-leave", delete_leave);
}

async function get_all_leaves_for_caretaker(req, res) {
    try {
        const client = await pool.connect();
        const username = req.query.username;
        const query = ` SELECT *
            FROM leave_days
            WHERE username = '${username}'
            ORDER BY end_date DESC;
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
        const result = await client.query(query);

        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(result));
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

async function delete_leave(req, res) {
    // format of request body:
    // {
    //      "username": "username",
    //      "start_date": "xxx",
    //      "end_date": "xxx",
    // }
    try {
        const client = await pool.connect();
        const username = req.body.username;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        const query = ` DELETE FROM leave_days
            WHERE username = '${username}' 
                AND start_date = TO_DATE('${start_date}', 'YYYY-MM-DD') 
                AND end_date = TO_DATE('${end_date}', 'YYYY-MM-DD');
        `;
        const result = await client.query(query);

        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(result));
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

module.exports = appRouter;