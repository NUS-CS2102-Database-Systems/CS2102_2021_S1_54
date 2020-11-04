app.get("/pet-care/pet-owners?username=${props.username}", async function (
  req,
  res
) {
  // https://stackoverflow.com/questions/63321982/is-there-a-way-to-send-data-from-the-frontend-to-the-server-with-an-axios-get-re
  let pet_owner_details_wanted = req.query.username;
  const get_pet_owner_details =
    "SELECT username, name, AGE(CURRENT_DATE, date_birth) AS age, gender, phone, email, address" +
    " FROM user NATURAL JOIN pet_owner" +
    " WHERE username = '" +
    pet_owner_details_wanted +
    "'";

  try {
    await client.query(get_pet_owner_details).then((resp) => {
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
});
