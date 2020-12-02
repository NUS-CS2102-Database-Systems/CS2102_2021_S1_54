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
    const caretaker = req.body.toGet.caretaker;

    const result = await client.query(
      `SELECT p.pet_name AS pet_name, r.current_daily_price AS current_daily_price 
        FROM pet p JOIN daily_price_rate r ON p.type_of_animal = r.type_name
        WHERE p.username = '${username}' AND r.username = '${caretaker}';`
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
      `SELECT 1 AS valid_card
      FROM pet_owner 
        WHERE username = '${username}' AND credit_card_number IS NOT NULL
          AND credit_card_full_name IS NOT NULL AND credit_card_expiry_date IS NOT NULL;`
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

    var overlapping_bid = await client.query(`
      SELECT COUNT(*) AS num_overlap
      FROM bid_transaction 
      WHERE pet_name = '${pet}' AND pusername = '${username}'
        AND (job_start_datetime, job_end_datetime) OVERLAPS ('${job_start_datetime}', '${job_end_datetime}');
      `); //2020-12-02', '2020-12-02'); //sborrownx

    if (overlapping_bid[0].num_overlap >= 1) {
      res.send("This bid's timeframe overlaps with an existing sucessful bid.");
      client.release();
      return;
    }

    // check wether caretaker's pet limit has been reached
    var start = new Date(job_start_datetime);
    start.setHours(0, 0, 0, 0);
    var end = new Date(job_end_datetime);
    end.setHours(0, 0, 0, 0);

    console.log("In JS!");
    console.log(start);

    var date = start;
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24) + 1;
    var maxNumOfPets = 0;

    console.log("number of days is \n");
    console.log(differenceInDays);

    let dateEnd = new Date( //End of the day
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
      0,
      0,
      -1
    );

    for (var i = 0; i < differenceInDays; i++) {
      // check day by day
      var dateString = date.toISOString().replace(/T/, " ").substring(0, 19); //.substring(0, 10); // YYYY-MM-DD format
      var dateEndString = dateEnd
        .toISOString()
        .replace(/T/, " ")
        .substring(0, 19); //.substring(0, 10); // YYYY-MM-DD format

      var numberOfPets = await client.query(`
      SELECT COUNT(*) AS num_pets
      FROM bid_transaction 
      WHERE cusername = '${caretaker}' 
        AND (job_start_datetime, job_end_datetime) OVERLAPS ('${dateString}', '${dateEndString}');
      `); //2020-12-02', '2020-12-02'); //sborrownx

      if (numberOfPets.rows[0].num_pets > maxNumOfPets) {
        console.log("numberOfPets is \n");
        console.log(numberOfPets.rows[0].num_pets);
        maxNumOfPets = numberOfPets.rows[0].num_pets;
      }

      console.log("date is \n");
      console.log(date);

      date.setDate(date.getDate() + 1);
      dateEnd.setDate(dateEnd.getDate() + 1);
    }

    console.log("max number is:");
    console.log(maxNumOfPets);

    const checkFulltime = await client.query(
      `SELECT * FROM full_time_caretaker WHERE username = '${caretaker}';`
    );
    if (checkFulltime.rowCount === 1) {
      // caretaker is full time
      console.log("it's a full time caretaker");
      if (maxNumOfPets >= 5) {
        res.send("Pet limit reached for full-time caretaker.");
        client.release();
        return;
      }
    } else {
      // caretaker is part time
      console.log("it's a part time caretaker");
      const checkPetLimit = await client.query(`
        SELECT number_of_pets_allowed
        FROM availabilities 
        WHERE username = '${caretaker}' 
        ORDER BY start_date DESC LIMIT 1;
      `);
      if (maxNumOfPets >= checkPetLimit.rows[0].number_of_pets_allowed) {
        console.log("checkPetLimit is \n");
        console.log(checkPetLimit.rows[0].number_of_pets_allowed);

        res.send("Pet limit reached for part-time caretaker.");
        client.release();
        return;
      }
    }

    var result = await client.query(
      // Check if the same bid exist!
      `SELECT 2 AS result
        FROM bid_transaction
        WHERE pusername = '${username}' AND cusername = '${caretaker}' AND pet_name = '${pet}' AND
        job_start_datetime = '${job_start_datetime}' AND job_end_datetime = '${job_end_datetime}';`
    );

    if (result.rows[0] == null) {
      //!= 2) {
      const query = `INSERT INTO bid_transaction VALUES('${username}', '${pet}', '${caretaker}',
      '${biddingtime}', '${job_start_datetime}', '${job_end_datetime}', '${payment_datetime}', 
      '${amount}', '${payment_method}', '${start_transfer_method}', '${end_transfer_method}', 
      true, NULL, NULL);`;

      await client.query(query);

      result = await client.query(
        `SELECT 1 AS result
        FROM bid_transaction
        WHERE pusername = '${username}' AND cusername = '${caretaker}' AND pet_name = '${pet}' AND
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
