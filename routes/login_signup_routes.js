const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

var appRouter = function (app) { 
    app.get("/users", get_all_users);
    app.post("/users", create_user);
    app.post("/users/pet-owners", create_petowner);
    app.post("/users/caretakers/fulltime", create_fulltime_caretaker);
    app.post("/users/caretakers/parttime", create_parttime_caretaker);
    app.put("/users", update_user);
    app.put("/users/pet-owners", update_pet_owner);
    app.put("/users/caretakers", update_care_taker);
    app.delete("/users", delete_user);
}

async function get_all_users(req, res) {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM user;");
        // const results = { results: result ? result.rows : null };

        res.send(JSON.stringify(result.rows));
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

// creates generic user. need to call other methods to create pet owner / caretaker
async function create_user(req, res) {
    try {
        const client = await pool.connect();
        const username = req.body.username;
        const password = req.body.password;
        const name = req.body.name;
        const birth_date = req.body.birth_date;
        const gender = req.body.gender;
        const phone = req.body.phone;
        const email = req.body.email;
        const address = req.body.address;

        // check existence of user
        const result = await client.query(`SELECT * FROM user WHERE username = '${username}'`);
        if (result.rowCount !== 0) {
            res.send("username already exists!");
        } else {
            const query = `
            INSERT INTO user VALUES('${username}', '${password}',
                '${name}', '${birth_date}', '${gender}', ${phone}, '${email}', '${address}');`
            
            const result = await client.query(query);
    
            res.send(JSON.stringify(result.rows));
        }
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

// assumes user already created
async function create_petowner(req, res) {
    try {
        const client = await pool.connect();
        const username = req.body.username;

        const query = `INSERT INTO pet_owner VALUES('${username}', NULL, NULL, NULL);`
        const result = await client.query(query);
        res.send(JSON.stringify(result.rows));

        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

// assumes user already created
async function create_fulltime_caretaker(req, res) {
    try {
        const client = await pool.connect();
        const username = req.body.username;

        const query1 = `INSERT INTO caretaker VALUES('${username}', DEFAULT, CURRENT_DATE);`
        const result1 = await client.query(query1);
        
        const query2 = `INSERT INTO full_time_caretaker VALUES('${username}');`
        const result2 = await client.query(query2);
        
        res.send(JSON.stringify(result2.rows));

        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

// assumes user already created
async function create_parttime_caretaker(req, res) {
    try {
        const client = await pool.connect();
        const username = req.body.username;

        const query1 = `INSERT INTO caretaker VALUES('${username}', DEFAULT, CURRENT_DATE);`
        const result1 = await client.query(query1);
        
        const query2 = `INSERT INTO part_time_caretaker VALUES('${username}');`
        const result2 = await client.query(query2);
        
        res.send(JSON.stringify(result2.rows));

        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

async function update_user(req, res) {
    try {
        const client = await pool.connect();

        const username = req.body.username;

        var is_req_body_empty = true;
        for (const [key, value] of Object.entries(req.body)) {
            const update_query = `UPDATE user `
            + `SET ${key} = '${value}' WHERE username = ${username};`;
            await client.query(update_query);
            is_req_body_empty = false
        }

        const result = await client.query(`SELECT * FROM user WHERE username = ${username};`);
        if (result.rowCount != 0 && !is_req_body_empty) {
            res.setHeader('content-type', 'application/json');
            res.send(JSON.stringify(result.rows[0]));
        } else if (result.rowCount == 0) {
            res.status(404).send("This user does not exist.");
        } else {
            res.status(400).send("Request body cannot be empty.");
        }
        client.release();
    } catch (err) {
        console.error(err);
        res.status(400).send("Error " + err);
    }
}

async function update_pet_owner(req, res) {
    try {
        const client = await pool.connect();
        const username = req.body.username;
        const credit_card_number = req.body.credit_card_number;
        const credit_card_full_name = req.body.credit_card_full_name;
        const credit_card_expiry_date = req.body.credit_card_expiry_date;
        const update_query = `UPDATE pet_owner SET credit_card_number = '${credit_card_number}',
            credit_card_full_name = '${credit_card_full_name}', credit_card_expiry_date='${credit_card_expiry_date}'
            WHERE username = '${username}'`;
        const result = await client.query(update_query);

        res.send(JSON.stringify(result.rows));
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

async function update_care_taker(req, res) {
    try {
        const client = await pool.connect();
        const username = req.body.username;
        const average_rating = req.body.average_rating;
        const update_query = `UPDATE care_taker SET average_rating = ${average_rating}
            WHERE username = '${username}'`;
        const result = await client.query(update_query);

        res.send(JSON.stringify(result.rows));
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

async function delete_user(req, res) {
    try {
        const client = await pool.connect();
        const username = req.body.username;
        const delete_query = `DELETE FROM user WHERE username = '${username}'`;
        const result = await client.query(delete_query);

        res.send(JSON.stringify(result.rows));
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
}

module.exports = appRouter;