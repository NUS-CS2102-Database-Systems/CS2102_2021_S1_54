
function add_new_user(username, password, name, date_of_birth, gender, phone_number, email, address) {
    return ```
        INSERT INTO users VALUES('${username}', '${password}', '${name}', '${date_of_birth}', 
            '${gender}', '${phone_number}', '${email}', '${address}');
    ```;
}

// module.exports = xxx;