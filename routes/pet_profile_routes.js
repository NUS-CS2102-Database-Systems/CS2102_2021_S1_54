const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var appRouter = function (app) {
  app.post("/pet-owners/get-pet-information", get_pet_information);
  app.post("/pet-owners/add-pet-information", add_pet_information);
  app.post("/pet-owners/delete-pet-information", delete_pet_information);
  app.post(
    "/pet-owners/get-specific-pet-information",
    get_specific_pet_information
  );
  app.post(
    "/pet-owners/edit-specific-pet-information",
    edit_specific_pet_information
  );
};

async function get_pet_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;

    const result = await client.query(
      `SELECT pet_name, birth_date, AGE(birth_date) AS age, 
      breed, type_of_animal, gender, med_hist, special_req FROM pet WHERE username = '${username}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function add_pet_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toAdd.username;
    const pet_name = req.body.toAdd.pet_name;
    const birth_date = req.body.toAdd.birth_date;
    const gender = req.body.toAdd.gender;
    const breed = req.body.toAdd.breed;
    const type_of_animal = req.body.toAdd.animal_type;
    const med_hist = req.body.toAdd.med_hist;
    const special_req = req.body.toAdd.special_req;

    if (med_hist == null) {
      med_hist = null;
    } else {
      med_hist = "'" + med_hist + "'";
    }

    if (special_req == null) {
      special_req = null;
    } else {
      special_req = "'" + special_req + "'";
    }

    const insert_query = `INSERT INTO pet VALUES ('${username}', '${pet_name}', '${birth_date}', 
    '${breed}', '${type_of_animal}', '${gender}', ${med_hist}, ${special_req});`;

    await client.query(insert_query);

    // const result = await client.query(
    //   `SELECT EXISTS (SELECT 1 FROM pet WHERE username = '${username}'
    //     AND pet_name = '${pet_name}') AS exists;`
    // );

    res.setHeader("content-type", "application/json");
    // res.send(JSON.stringify(result.rows));
    res.sendStatus(200);

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function delete_pet_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toDelete.username;
    const pet_name = req.body.toDelete.pet;

    const delete_pet = `DELETE FROM pet WHERE username = '${username}' AND pet_name = '${pet_name}';`;
    await client.query(delete_pet);

    const result = await client.query(
      `SELECT EXISTS (SELECT 1 FROM pet WHERE username = '${username}' 
      AND pet_name = '${pet_name}');`
    );
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function get_specific_pet_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toGet.username;
    const pet_name = req.body.toGet.pet_name;

    const result = await client.query(
      `SELECT birth_date, AGE(birth_date) AS pet_age, breed, type_of_animal, 
      gender, med_hist, special_req FROM pet WHERE username = '${username}' 
      AND pet_name = '${pet_name}';`
    );

    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(result.rows));
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
}

async function edit_specific_pet_information(req, res) {
  try {
    const client = await pool.connect();
    const username = req.body.toEdit.username;
    const pet_name = req.body.toEdit.card_number;
    const pet_med_hist = req.body.toEdit.med_hist;
    const pet_special_req = req.body.toEdit.special_req;

    if (pet_med_hist == null) {
      pet_med_hist = null;
    } else {
      pet_med_hist = "'" + pet_med_hist + "'";
    }

    if (pet_special_req == null) {
      pet_special_req = null;
    } else {
      pet_special_req = "'" + pet_special_req + "'";
    }

    const edit_pet_details = `UPDATE pet SET med_hist = ${pet_med_hist}, 
      special_req = ${pet_special_req} WHERE username = '${username}' 
      AND pet_name = '${pet_name}';`;

    await client.query(edit_pet_details);

    const result = await client.query(
      `SELECT med_hist, special_req FROM pet WHERE username = '${username}' 
      AND pet_name = '${pet_name}';`
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
