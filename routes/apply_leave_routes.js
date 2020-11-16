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

        // get all leave periods in this year
        const getLeavesQuery = `SELECT start_date, end_date 
            FROM leave_days 
            WHERE username = '${username}' 
                AND (DATE_PART('YEAR', start_date) = DATE_PART('YEAR', NOW())
                OR DATE_PART('YEAR', end_date) = DATE_PART('YEAR', NOW()));`;
        var leavesResult = await client.query(getLeavesQuery);
        leavesResult = leavesResult.rows;
        console.log(leavesResult);
        var leavesArray = []
        for (var i = 0; i < leavesResult.length; i++) {
            const leave = leavesResult[i];
            const leaveStart = new Date(leave.start_date);
            const leaveEnd = new Date(leave.end_date);
            console.log([leaveStart, leaveEnd]);
            leavesArray.push([leaveStart, leaveEnd]);
        }
        const firstDayOfYear = new Date(new Date(start_date).getFullYear(), 0, 1);
        if (leavesArray.length > 0 && leavesArray[0][0] > firstDayOfYear) {
            leavesArray.push([firstDayOfYear, firstDayOfYear]);
        } 
        const lastDayOfYear = new Date(new Date(start_date).getFullYear(), 11, 31);
        if (leavesArray.length > 0 && leavesArray[leavesArray.length - 1][1] < lastDayOfYear) {
            leavesArray.push([lastDayOfYear, lastDayOfYear]);
        }
        if (leavesArray.length === 0) {
            leavesArray.push([firstDayOfYear, firstDayOfYear]);
            leavesArray.push([lastDayOfYear, lastDayOfYear]);
        }

        leavesArray.push([new Date(start_date), new Date(end_date)]);
        leavesArray.sort((a, b) => {
            if (a[1] < b[1]) {
                return -1;
            } else {
                return 1;
            }
        });

        // check for 2x150 consecutive days requirement
        var count = 0; // number of 150-day block
        for (var i = 0; i < leavesArray.length - 1; i++) {
            const firstEndDate = leavesArray[i][1];
            const secondStartDate = leavesArray[i + 1][0];
            const differenceInTime = secondStartDate.getTime() - firstEndDate.getTime();
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);
            if (differenceInDays >= 2 * 150) {
                count += 2;
            } else if (differenceInDays >= 150) {
                count += 1;
            }
        }

        if (count < 2) {
            res.send("You need to fulfil the requirement of 2 x 150 consecutive work days!");
        } else {
            const query = `INSERT INTO leave_days
                VALUES('${username}', '${reason_for_leave}', '${start_date}', '${end_date}');
            `;
            const result = await client.query(query);

            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify(result));
        }

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