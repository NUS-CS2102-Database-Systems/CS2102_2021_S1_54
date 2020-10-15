// // View ongoing jobs for all caretakers
// app.get("/pet-care/pcs-admin/ongoing_jobs", async function (req, res) {
//   const get_all_caretaker_ongoing_jobs =
//     "SELECT * FROM bid_transaction " +
//     "WHERE is_successful_bid = true AND job_start_datetime <= localtimestamp" +
//     "AND job_end_datetime >= localtimestamp" +
//     " ORDER BY username ASC, job_start_datetime ASC, job_end_datetime ASC";

//   try {
//     await client.query(get_all_caretaker_ongoing_jobs).then((resp) => {
//       let arr = [];
//       let len = resp.rows.length;
//       for (var i = 0; i < len; i++) {
//         let result = resp.rows[i];
//         arr.push(result);
//       }
//       res.send(arr);
//     });
//   } catch (err) {
//     console.error(err.stack);
//   }
// });

// // View filtered jobs for caretakers
// app.post("/pet-care/pcs-admin/jobs", async function (req, res) {
//   let date_from = req.body.pcsadmin.start_date;
//   let date_to = req.body.pcsadmin.end_date;
//   let caretaker_username = req.body.pcsadmin.caretaker_username;
//   let commitment = req.body.pcsadmin.commitment;

//   const get_selected_caretaker_jobs =
//     "SELECT * FROM bid_transaction " +
//     "WHERE is_successful_bid = true AND job_start_datetime <= localtimestamp" +
//     "AND job_end_datetime >= localtimestamp" +
//     " ORDER BY username ASC, job_start_datetime ASC, job_end_datetime ASC";

//   try {
//     await client.query(get_all_caretaker_ongoing_jobs).then((resp) => {
//       let arr = [];
//       let len = resp.rows.length;
//       for (var i = 0; i < len; i++) {
//         let result = resp.rows[i];
//         arr.push(result);
//       }
//       res.send(arr);
//     });
//   } catch (err) {
//     console.error(err.stack);
//   }
// });
