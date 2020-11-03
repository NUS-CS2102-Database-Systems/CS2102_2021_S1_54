const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

var appRouter = function (app) { 
    app.get("/reviews/:cusername", get_all_reviews_for_caretaker);
    app.post("/reviews", submit_review);
}

async function get_all_reviews_for_caretaker(req, res) {
    // format of respond body:
    // {
    //     "cusername": "xxx",
    //     "reviewer": "xxx",
    //     "review": "xxx",
    //     "rating": "xxx",
    //     "review_time" "xxx"
    // }
    try {
        const client = await pool.connect();
        const cusername = req.query.cusername;
        const query = ` SELECT cusername, pusername AS reviewer, review, rating, review_time
            FROM bid_transaction
            WHERE cusername = '${cusername}'
            ORDER BY review_time DESC;
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

// same function for edit review
async function submit_review(req, res) {
    // format of request body:
    // {
    //      "pusername": "xxx", 
    //      "cusername": "xxx", 
    //      "pet_name": "xxx", 
    //      "job_start_datetime": "xxx", 
    //      "job_end_datetime": "xxx", 
    //      "review": "xxx",
    //      "rating": "xxx",
    // }
    try {
        const client = await pool.connect();
        const pusername = req.body.pusername;
        const cusername = req.body.cusername;
        const pet_name = req.body.pet_name;
        const job_start_datetime = req.body.job_start_datetime;
        const job_end_datetime = req.body.job_end_datetime;
        const review = req.body.review;
        const rating = req.body.rating;
        const query = ` UPDATE bid_transaction 
            SET review = '${review}', rating = ${rating}, review_time = NOW()
            WHERE pusername = '${pusername}' AND cusername = '${cusername}' AND pet_name = '${pet_name}'
                AND job_start_datetime = '${job_start_datetime}' AND job_end_datetime = '${job_end_datetime}'
        `;
        await client.query(query);

        res.send("Review submitted!");
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

module.exports = appRouter;