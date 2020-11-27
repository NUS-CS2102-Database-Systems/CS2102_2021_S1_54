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

    let salaryObj = { fullTime: {}, partTime: {} };

    const fullTimeSalary = await client.query(
      `SELECT SUM(salary) AS salary_full_time 
        FROM salary_calculation_for_full_time;`
    );

    salaryObj.fullTime = fullTimeSalary;

    const partTimeSalary = await client.query(
      `SELECT SUM(salary) AS salary_part_time 
        FROM salary_calculation_for_part_time;`
    );

    salaryObj.partTime = partTimeSalary;

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

module.exports = appRouter;
