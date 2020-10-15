// View past jobs
app.get(
  "/pet-care/jobs?caretaker_username=${props.username}&type=past",
  async function (req, res) {
    // https://stackoverflow.com/questions/63321982/is-there-a-way-to-send-data-from-the-frontend-to-the-server-with-an-axios-get-re
    let caretaker_username = req.query.caretaker_username;
    const get_past_job_details =
      "SELECT *" +
      " FROM bid_transaction" +
      " WHERE cusername = '" +
      caretaker_username +
      "' AND is_successful_bid = true " +
      "AND job_start_datetime < localtimestamp " +
      "AND job_end_datetime < localtimestamp ORDER BY job_start_datetime ASC, job_end_datetime ASC";

    try {
      await client.query(get_past_job_details).then((resp) => {
        let arr = [];
        let len = resp.rows.length;
        for (var i = 0; i < len; i++) {
          let result = resp.rows[i];
          arr.push(result);
        }
        res.send(arr);
      });
    } catch (err) {
      console.error(err.stack);
    }
  }
);

// View ongoing jobs
app.get(
  "/pet-care/jobs?caretaker_username=${props.username}&type=ongoing",
  async function (req, res) {
    // https://stackoverflow.com/questions/63321982/is-there-a-way-to-send-data-from-the-frontend-to-the-server-with-an-axios-get-re
    let caretaker_username = req.query.caretaker_username;
    const get_ongoing_job_details =
      "SELECT *" +
      " FROM bid_transaction" +
      " WHERE cusername = '" +
      caretaker_username +
      "' AND is_successful_bid = true " +
      "AND job_start_datetime <= localtimestamp " +
      "AND job_end_datetime >= localtimestamp ORDER BY job_start_datetime ASC, job_end_datetime ASC";

    try {
      await client.query(get_ongoing_job_details).then((resp) => {
        let arr = [];
        let len = resp.rows.length;
        for (var i = 0; i < len; i++) {
          let result = resp.rows[i];
          arr.push(result);
        }
        res.send(arr);
      });
    } catch (err) {
      console.error(err.stack);
    }
  }
);

// View future jobs
app.get(
  "/pet-care/jobs?caretaker_username=${props.username}&type=future",
  async function (req, res) {
    // https://stackoverflow.com/questions/63321982/is-there-a-way-to-send-data-from-the-frontend-to-the-server-with-an-axios-get-re
    let caretaker_username = req.query.caretaker_username;
    const get_future_job_details =
      "SELECT *" +
      " FROM bid_transaction" +
      " WHERE cusername = '" +
      caretaker_username +
      "' AND is_successful_bid = true " +
      "AND job_start_datetime > localtimestamp " +
      "AND job_end_datetime > localtimestamp ORDER BY job_start_datetime ASC, job_end_datetime ASC";

    try {
      await client.query(get_future_job_details).then((resp) => {
        let arr = [];
        let len = resp.rows.length;
        for (var i = 0; i < len; i++) {
          let result = resp.rows[i];
          arr.push(result);
        }
        res.send(arr);
      });
    } catch (err) {
      console.error(err.stack);
    }
  }
);
