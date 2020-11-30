const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.post(
    "/pet-owners/view-caretakers-profiles/bid-pets-options",
    get_bidding_options_for_pets
  );
  // app.post(
  //   "/pet-owners/view-caretakers-profiles/bid-date-options",
  //   get_bidding_options_for_date
  // );
  app.post(
    "/pet-owners/view-caretakers-profiles/bid/able-to-pay_by-card",
    check_for_card
  );
  app.post("/pet-owners/view-caretakers-profiles/bid/pay", submit_a_bid);
};

async function get_bidding_options_for_pets(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;
    //const caretaker = req.body.toGet.caretaker;

    const result = await client.query(
      `SELECT p.pet_name AS pet_name, r.current_daily_price AS current_daily_price 
        FROM pet p JOIN daily_price_rate r ON (p.username = r.username AND p.type_of_animal = r.type_name)
        WHERE p.username = '${username}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

// async function get_bidding_options_for_date(req, res) {
//   try {
//     const client = await pool.connect();
//     //const username = req.body.toGet.username;
//     const caretaker = req.body.toGet.caretaker;

//     const result = await client.query(
//       `SELECT
//         FROM
//         WHERE  = '${careaker}';`
//     );

//     res.setHeader("content-type", "application/json");
//     res.send(JSON.stringify(result.rows));
//     client.release();
//   } catch (err) {
//     console.error(err);
//     res.send("Error " + err);
//   }
// }

async function check_for_card(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;
    //const caretaker = req.body.toGet.caretaker;

    const result = await client.query(
      `SELECT 1
        FROM pet_owner
        WHERE username = '${username}' AND credit_card_number != NULL 
          AND credit_card_full_name != NULL AND credit_card_full_name != NULL;`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function submit_a_bid(req, res) {
  try {
    const client = await pool.connect();
    //const username = req.body.toGet.username;
    //const caretaker = req.body.toGet.caretaker;
    const username = req.body.toBid.username;
    const pet = req.body.toBid.pet;
    const caretaker = req.body.toBid.caretaker;
    const biddingtime = req.body.toBid.bidding_time;
    const job_start_datetime = req.body.toBid.job_start_datetime;
    const job_end_datetime = req.body.toBid.job_end_datetime;
    const payment_datetime = req.body.toBid.payment_datetime;
    const amount = req.body.toBid.amount;
    const payment_method = req.body.toBid.payment_method;
    const start_transfer_method = req.body.toBid.start_transfer_method;
    const end_transfer_method = req.body.toBid.end_transfer_method;

    const result = await client.query(
      // Check if the same bid exist!
      `SELECT 2
        FROM bid_transaction
        WHERE username = '${username}' AND cusername = '${caretaker}' AND pet_name = '${pet}' AND
        job_start_datetime = '${job_start_datetime}' AND job_end_datetime = '${job_end_datetime}';`
    );

    if (result.rows[0] == NULL) {
      //!= 2) {
      const query = `INSERT INTO bid_transaction VALUES('${username}', '${pet}', '${caretaker}',
      '${biddingtime}', '${job_start_datetime}', '${job_end_datetime}', '${payment_datetime}', 
      '${amount}', '${payment_method}', '${start_transfer_method}', '${end_transfer_method}', 
      true, NULL, NULL);`;

      await client.query(query);

      const result = await client.query(
        `SELECT 1
        FROM bid_transaction
        WHERE username = '${username}' AND cusername = '${caretaker}' AND pet_name = '${pet}' AND
        job_start_datetime = '${job_start_datetime}' AND job_end_datetime = '${job_end_datetime}';`
      );
    }

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

module.exports = appRouter;
