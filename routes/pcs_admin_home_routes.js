const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.get(
    "/pcs-admin/get-num-pets-cared-for-and-amount-earned",
    get_num_pets_cared_for_and_amount_earned
  );
  app.get("/pcs-admin/get-num-pet-days", get_num_pet_days);
  app.get(
    "/pcs-admin/get-caretakers-total-salary",
    get_caretakers_total_salary
  );
  app.get(
    "/pcs-admin/get-num-pets-and-pet-days-and-salary-for-each-caretaker",
    get_num_pets_and_petdays_and_salary_for_each_caretaker
  );
  app.get("/pcs-admin/get-num-full-time-caretakers", get_ft_caretakers_count);
};

async function get_num_pets_cared_for_and_amount_earned(req, res) {
  try {
    const client = await pool.connect();
    let date = new Date();
    let first_day = new Date(date.getFullYear(), date.getMonth(), 1);
    first_day.setHours(first_day.getHours() + 8);
    let firstDate = first_day.toISOString().substr(0, 10);

    const result = await client.query(
      `SELECT COUNT(*) AS num_of_pets, SUM(amount) AS amount_earned 
        FROM bid_transaction WHERE job_end_datetime >= '${firstDate}' 
        AND job_end_datetime <= current_date;`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_num_pet_days(req, res) {
  try {
    const client = await pool.connect();

    const result = await client.query(
      `SELECT SUM(pet_days) AS num_pet_days FROM pet_days_past_30_days;`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_caretakers_total_salary(req, res) {
  try {
    const client = await pool.connect();

    const result = await client.query(
      `SELECT SUM(salary) AS salary 
        FROM salary_calculation_for_full_time 
        UNION 
        SELECT SUM(salary) AS salary FROM 
        salary_calculation_for_part_time;`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_ft_caretakers_count(req, res) {
  try {
    const client = await pool.connect();

    const result = await client.query(
      `SELECT COUNT(*) AS num_ft FROM full_time_caretaker;`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_num_pets_and_petdays_and_salary_for_each_caretaker(
  req,
  res
) {
  try {
    const client = await pool.connect();

    // const result = await client.query(
    //   `SELECT cusername, COUNT(*) AS num_pets, SUM(pet_days) AS num_pet_days FROM bid_transaction NATURAL JOIN pet_days_past_30_days
    //   WHERE job_end_datetime >= DATE_TRUNC('MONTH', NOW()) AND job_end_datetime <=  DATE_TRUNC('DAY', NOW())
    //   GROUP BY cusername;`
    // );

    // `SELECT SFT.cusername, CASE
    //                             WHEN (SELECT COUNT(*)
    //                                   FROM bid_transaction
    //                                   WHERE job_end_datetime >= DATE_TRUNC('MONTH', NOW()) AND
    //                                   job_end_datetime <=  (DATE_TRUNC('DAY', NOW()) + interval '1 day' - interval '1 millisecond')
    //                                   AND cusername = SFT.cusername) > 0 THEN (SELECT COUNT(*)
    //                                                                           FROM bid_transaction
    //                                                                           WHERE job_end_datetime >= DATE_TRUNC('MONTH', NOW()) AND
    //                                                                           job_end_datetime <=  (DATE_TRUNC('DAY', NOW()) + interval '1 day' - interval '1 millisecond')
    //                                                                           AND cusername = SFT.cusername)
    //                             ELSE 0 END AS num_pets, CASE
    //                                                         WHEN (SELECT SUM(pet_days)
    //                                                               FROM pet_days_past_30_days
    //                                                               WHERE cusername = SFT.cusername) > 0 THEN (SELECT SUM(pet_days)
    //                                                                                                         FROM pet_days_past_30_days
    //                                                                                                         WHERE cusername = SFT.cusername)
    //                                                         ELSE 0 END AS num_pet_days, SFT.salary
    //   FROM salary_calculation_for_full_time SFT
    //   GROUP BY SFT.cusername, SFT.salary;`

    const result = await client.query(
      `SELECT SFT.cusername, CASE 
                                WHEN (SELECT COUNT(*) 
                                      FROM bid_transaction 
                                      WHERE job_end_datetime >= DATE_TRUNC('MONTH', NOW()) AND 
                                      job_end_datetime <=  (DATE_TRUNC('DAY', NOW()) + interval '1 day' - interval '1 millisecond') 
                                      AND cusername = SFT.cusername) > 0 THEN (SELECT COUNT(*) 
                                                                              FROM bid_transaction 
                                                                              WHERE job_end_datetime >= DATE_TRUNC('MONTH', NOW()) AND 
                                                                              job_end_datetime <=  (DATE_TRUNC('DAY', NOW()) + interval '1 day' - interval '1 millisecond') 
                                                                              AND cusername = SFT.cusername) 
                                ELSE 0 END AS num_pets, CASE 
                                                            WHEN (SELECT SUM(pet_days) 
                                                                  FROM pet_days_past_30_days 
                                                                  WHERE cusername = SFT.cusername) > 0 THEN (SELECT SUM(pet_days) 
                                                                                                            FROM pet_days_past_30_days 
                                                                                                            WHERE cusername = SFT.cusername) 
                                                            ELSE 0 END AS num_pet_days, SFT.salary 
      FROM salary_calculation_for_full_time SFT 
      GROUP BY SFT.cusername, SFT.salary 
      UNION 
      SELECT cusername, COUNT(*) AS num_pets, SUM(pet_days) AS num_pet_days, salary FROM bid_transaction NATURAL JOIN pet_days_past_30_days 
      NATURAL JOIN salary_calculation_for_part_time 
      WHERE job_end_datetime >= DATE_TRUNC('MONTH', NOW()) AND job_end_datetime <=  (DATE_TRUNC('DAY', NOW()) + interval '1 day' - interval '1 millisecond') 
      GROUP BY cusername, salary;`
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
