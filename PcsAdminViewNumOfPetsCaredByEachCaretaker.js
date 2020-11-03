const express = require("express");
const app = express();

app.get("/pcs-admin-total-cared-pets-per-caretaker", async (req, res) {
    // https://stackoverflow.com/questions/63321982/is-there-a-way-to-send-data-from-the-frontend-to-the-server-with-an-axios-get-re
    // let pet_owner_details_wanted = req.query.username;
    const queryTotalCaredByEachCaretaker = 
    "SELECT COUNT(*) FROM bid_transaction GROUP BY cusername ";

    try {
      await client.query(queryTotalCaredByEachCaretaker).then((resp) => {
        console.log("entered num of pets cared for by each caregiver");
        let arr = [];
        let len = resp.rows.length;
        for (var i = 0; i < len; i++) {
          let result = resp.rows[i];
          arr.push(result);
        }
        res.send(arr);
      });
    } catch (err) {
      console.log("ERROR entered num of pets cared for by each caregiver");

      console.error(err.stack);
    }
  });
