app.get(
  "/pet-care/pets?pet_owner_username=${props.username}&pet_name=${props.name}",
  async function (req, res) {
    // https://stackoverflow.com/questions/63321982/is-there-a-way-to-send-data-from-the-frontend-to-the-server-with-an-axios-get-re
    let pet_owner_details_wanted = req.query.pet_owner_username;
    let pet_details_wanted = req.query.pet_name;
    const get_pet_details =
      "SELECT username, pet_name, AGE(CURRENT_DATE, birth_date) AS age, breed, type_of_animal, gender, med_hist, special_req" +
      " FROM pet" +
      " WHERE username = '" +
      pet_owner_details_wanted +
      "' AND pet_name = '" +
      pet_details_wanted +
      "'";

    try {
      await client.query(get_pet_details).then((resp) => {
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
