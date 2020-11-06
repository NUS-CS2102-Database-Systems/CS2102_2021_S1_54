const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.post("/pet-owners/get-past-jobs-information", get_past_jobs_information);
  app.post(
    "/pet-owners/get-specific-past-jobs-information",
    get_specific_past_jobs_information
  );
  app.post(
    "/pet-owners/get-ongoing-jobs-information",
    get_ongoing_jobs_information
  );
  app.post(
    "/pet-owners/get-upcoming-jobs-information",
    get_upcoming_jobs_information
  );
  app.post(
    "/pet-owners/get-specific-upcoming-jobs-information",
    get_specific_upcoming_jobs_information
  );
  app.post("/pet-owners/get-pet-names", get_pet_names);
};

async function get_past_jobs_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT u.username AS username, bt.pet_name AS pet_name, 
      bt.job_start_datetime AS job_start_datetime, bt.job_end_datetime AS job_end_datetime,
      bt.start_transfer_method AS start_transfer_method, 
      bt.end_transfer_method AS end_transfer_method, bt.amount AS amount, bt.rating AS rating, 
      bt.review AS review, bt.payment_method AS payment_method, bt.payment_datetime AS payment_datetime 
      FROM users u INNER JOIN bid_transaction bt ON u.username = bt.cusername 
      WHERE bt.pusername = '${username}' AND 
      bt.job_start_datetime < current_timestamp AND 
      bt.job_end_datetime < current_timestamp;`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_specific_past_jobs_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;
    const dates_received = req.body.toGet.dates;
    let start_date = "";
    let end_date = "";

    if (dates_received != null) {
      let dates = dates_received.split(",");
      start_date = dates[0];
      end_date = dates[1];
    } else {
      start_date = null;
      end_date = null;
    }

    let pet_names = req.body.toGet.animal_names;
    let query = "";

    if (start_date != null && pet_names != null) {
      if (pet_names.includes(",")) {
        query = `SELECT u.username AS username, bt.pet_name AS pet_name, 
        bt.job_start_datetime AS job_start_datetime, bt.job_end_datetime AS job_end_datetime, 
        bt.start_transfer_method AS start_transfer_method, 
        bt.end_transfer_method AS end_transfer_method, bt.amount AS amount, bt.rating AS rating, 
        bt.review AS review, bt.payment_method AS payment_method, bt.payment_datetime AS payment_datetime  
        FROM users u INNER JOIN bid_transaction bt ON u.username = bt.cusername 
        WHERE bt.pusername = '${username}' AND bt.is_successful_bid = 'true' AND 
        bt.job_start_datetime BETWEEN '${start_date}' AND '${end_date}' AND 
        bt.job_end_datetime BETWEEN '${start_date}' AND '${end_date}' AND (`;
        let pet_names_split = pet_names.split(",");
        let length = pet_names_split.length;
        for (let i = 0; i < length; i++) {
          query += `bt.pet_name = '${pet_names_split[i]}' OR `;
        }
        query = query.slice(0, -4);
        query += `);`;
      } else {
        query = `SELECT u.username AS username, bt.pet_name AS pet_name, 
        bt.job_start_datetime AS job_start_datetime, bt.job_end_datetime AS job_end_datetime, 
        bt.start_transfer_method AS start_transfer_method, 
        bt.end_transfer_method AS end_transfer_method, bt.amount AS amount, bt.rating AS rating, 
        bt.review AS review, bt.payment_method AS payment_method, bt.payment_datetime AS payment_datetime 
        FROM users u INNER JOIN bid_transaction bt ON u.username = bt.cusername 
        WHERE bt.pusername = '${username}' AND bt.is_successful_bid = 'true' AND 
        bt.job_start_datetime BETWEEN '${start_date}' AND '${end_date}' AND 
        bt.job_end_datetime BETWEEN '${start_date}' AND '${end_date}' AND 
        bt.pet_name = '${pet_names}';`;
      }
    } else if (start_date != null && pet_names == null) {
      query = `SELECT * FROM bid_transaction WHERE pusername = '${username}' AND 
      job_start_datetime BETWEEN '${start_date}' AND '${end_date}' AND 
      job_end_datetime BETWEEN '${start_date}' AND '${end_date}';`;
    } else if (start_date == null && pet_names != null) {
      if (pet_names.includes(",")) {
        query = `SELECT u.username AS username, bt.pet_name AS pet_name, 
        bt.job_start_datetime AS job_start_datetime, bt.job_end_datetime AS job_end_datetime, 
        bt.start_transfer_method AS start_transfer_method, 
        bt.end_transfer_method AS end_transfer_method, bt.amount AS amount, bt.rating AS rating, 
        bt.review AS review, bt.payment_method AS payment_method, bt.payment_datetime AS payment_datetime  
        FROM users u INNER JOIN bid_transaction bt ON u.username = bt.cusername 
        WHERE bt.pusername = '${username}' AND bt.is_successful_bid = 'true' AND 
        bt.job_start_datetime < current_timestamp AND 
        bt.job_end_datetime < current_timestamp AND (`;
        let pet_names_split = pet_names.split(",");
        let length = pet_names_split.length;
        for (let i = 0; i < length; i++) {
          query += `bt.pet_name = '${pet_names_split[i]}' OR `;
        }
        query = query.slice(0, -4);
        query += `);`;
      } else {
        query = `SELECT u.username AS username, bt.pet_name AS pet_name, 
        bt.job_start_datetime AS job_start_datetime, bt.job_end_datetime AS job_end_datetime, 
        bt.start_transfer_method AS start_transfer_method, 
        bt.end_transfer_method AS end_transfer_method, bt.amount AS amount, bt.rating AS rating, 
        bt.review AS review, bt.payment_method AS payment_method, bt.payment_datetime AS payment_datetime  
        FROM users u INNER JOIN bid_transaction bt ON u.username = bt.cusername 
        WHERE bt.pusername = '${username}' AND bt.is_successful_bid = 'true' AND 
        bt.job_start_datetime < current_timestamp AND 
        bt.job_end_datetime < current_timestamp AND bt.pet_name = '${pet_names}';`;
      }
    } else {
      query = `SELECT u.username AS username, bt.pet_name AS pet_name, 
      bt.job_start_datetime AS job_start_datetime, bt.job_end_datetime AS job_end_datetime, 
      bt.start_transfer_method AS start_transfer_method, 
      bt.end_transfer_method AS end_transfer_method, bt.amount AS amount, bt.rating AS rating, 
      bt.review AS review, bt.payment_method AS payment_method, bt.payment_datetime AS payment_datetime  
      FROM users u INNER JOIN bid_transaction bt ON u.username = bt.cusername 
      WHERE bt.pusername = '${username}' AND bt.is_successful_bid = 'true' AND 
      bt.job_start_datetime < current_timestamp AND 
      bt.job_end_datetime < current_timestamp;`;
    }

    const result = await client.query(query);

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_ongoing_jobs_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT u.username AS username, u.name AS name, u.phone AS phone, u.email AS email, 
      u.address AS address, bt.pet_name AS pet_name, 
      bt.job_start_datetime AS job_start_datetime, bt.job_end_datetime AS job_end_datetime, 
      bt.start_transfer_method AS start_transfer_method, 
      bt.end_transfer_method AS end_transfer_method, bt.amount AS amount, 
      bt.payment_method AS payment_method, bt.payment_datetime AS payment_datetime 
      FROM users u INNER JOIN bid_transaction bt ON u.username = bt.cusername 
      WHERE bt.pusername = '${username}' AND bt.is_successful_bid = 'true' AND 
      bt.job_start_datetime <= current_timestamp AND 
      bt.job_end_datetime >= current_timestamp;`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_upcoming_jobs_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT * FROM bid_transaction WHERE pusername = '${username}' AND 
      is_successful_bid = 'true' AND job_start_datetime > current_timestamp;`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_specific_upcoming_jobs_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;
    const dates_received = req.body.toGet.dates;
    let pet_names = req.body.toGet.animal_names;
    let query = "";
    let start_date = "";
    let end_date = "";

    if (dates_received != null) {
      let dates = dates_received.split(",");
      start_date = dates[0];
      end_date = dates[1];
    } else {
      start_date = null;
      end_date = null;
    }

    if (start_date != null && pet_names != null) {
      if (pet_names.includes(",")) {
        query = `SELECT * FROM bid_transaction WHERE pusername = '${username}' AND 
        is_successful_bid = 'true' AND 
        job_start_datetime BETWEEN '${start_date}' AND '${end_date}' AND 
        job_end_datetime BETWEEN '${start_date}' AND '${end_date}' AND (`;
        let pet_names_split = pet_names.split(",");
        let length = pet_names_split.length;
        for (let i = 0; i < length; i++) {
          query += `pet_name = '${pet_names_split[i]}' OR `;
        }
        query = query.slice(0, -4);
        query += `);`;
      } else {
        query = `SELECT * FROM bid_transaction WHERE pusername = '${username}' AND 
        is_successful_bid = 'true' AND 
        job_start_datetime BETWEEN '${start_date}' AND '${end_date}' AND 
        job_end_datetime BETWEEN '${start_date}' AND '${end_date}' AND pet_name = '${pet_names}';`;
      }
    } else if (start_date != null && pet_names == null) {
      query = `SELECT * FROM bid_transaction WHERE pusername = '${username}' AND 
      is_successful_bid = 'true' AND 
      job_start_datetime BETWEEN '${start_date}' AND '${end_date}' AND 
      job_end_datetime BETWEEN '${start_date}' AND '${end_date}';`;
    } else if (start_date == null && pet_names != null) {
      if (pet_names.includes(",")) {
        query = `SELECT * FROM bid_transaction WHERE pusername = '${username}' AND 
        is_successful_bid = 'true' AND 
        job_start_datetime > current_timestamp AND (`;
        let pet_names_split = pet_names.split(",");
        let length = pet_names_split.length;
        for (let i = 0; i < length; i++) {
          query += `pet_name = '${pet_names_split[i]}' OR `;
        }
        query = query.slice(0, -4);
        query += `);`;
      } else {
        query = `SELECT * FROM bid_transaction WHERE pusername = '${username}' AND 
        is_successful_bid = 'true' AND 
        job_start_datetime > current_timestamp AND pet_name = '${pet_names}';`;
      }
    } else {
      query = `SELECT * FROM bid_transaction WHERE pusername = '${username}' AND 
      is_successful_bid = 'true' AND 
        job_start_datetime > current_timestamp;`;
    }

    const result = await client.query(query);

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_pet_names(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT pet_name FROM pet WHERE username = '${username}';`
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
