const { text } = require("body-parser");
const e = require("express");
const express = require("express");
const app = express();
const readline = require('readline');

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const FIRST_NAMES = ["Adam", "Alex", "Aaron", "Ben", "Carl", "Dan", "David", "Edward", "Fred", "Frank", "George", "Hal", "Hank", "Ike", "John", "Jack", "Joe", "Larry", "Monte", "Matthew", "Mark", "Nathan", "Otto", "Paul", "Peter", "Roger", "Roger", "Steve", "Thomas", "Tim", "Ty", "Victor", "Walter"];
const MIDDLE_NAMES = ["Anderson", "Ashwoon", "Aikin", "Bateman", "Bongard", "Bowers", "Boyd", "Cannon", "Cast", "Deitz", "Dewalt", "Ebner", "Frick", "Hancock", "Haworth", "Hesch", "Hoffman", "Kassing", "Knutson", "Lawless", "Lawicki", "Mccord", "McCormack", "Miller", "Myers", "Nugent", "Ortiz", "Orwig", "Ory", "Paiser", "Pak", "Pettigrew", "Quinn", "Quizoz", "Ramachandran", "Resnick", "Sagar", "Schickowski", "Schiebel", "Sellon", "Severson", "Shaffer", "Solberg", "Soloman", "Sonderling", "Soukup", "Soulis", "Stahl", "Sweeney", "Tandy", "Trebil", "Trusela", "Trussel", "Turco", "Uddin", "Uflan", "Ulrich", "Upson", "Vader", "Vail", "Valente", "Van Zandt", "Vanderpoel", "Ventotla", "Vogal", "Wagle", "Wagner", "Wakefield", "Weinstein", "Weiss", "Woo", "Yang", "Yates", "Yocum", "Zeaser", "Zeller", "Ziegler", "Bauer", "Baxster", "Casal", "Cataldi", "Caswell", "Celedon", "Chambers", "Chapman", "Christensen", "Darnell", "Davidson", "Davis", "DeLorenzo", "Dinkins", "Doran", "Dugelman", "Dugan", "Duffman", "Eastman", "Ferro", "Ferry", "Fletcher", "Fietzer", "Hylan", "Hydinger", "Illingsworth", "Ingram", "Irwin", "Jagtap", "Jenson", "Johnson", "Johnsen", "Jones", "Jurgenson", "Kalleg", "Kaskel", "Keller", "Leisinger", "LePage", "Lewis", "Linde", "Lulloff", "Maki", "Martin", "McGinnis", "Mills", "Moody", "Moore", "Napier", "Nelson", "Norquist", "Nuttle", "Olson", "Ostrander", "Reamer", "Reardon", "Reyes", "Rice", "Ripka", "Roberts", "Rogers", "Root", "Sandstrom", "Sawyer", "Schlicht", "Schmitt", "Schwager", "Schutz", "Schuster", "Tapia", "Thompson", "Tiernan", "Tisler"];
const LAST_NAMES = ["Anderson", "Ashwoon", "Aikin", "Bateman", "Bongard", "Bowers", "Boyd", "Cannon", "Cast", "Deitz", "Dewalt", "Ebner", "Frick", "Hancock", "Haworth", "Hesch", "Hoffman", "Kassing", "Knutson", "Lawless", "Lawicki", "Mccord", "McCormack", "Miller", "Myers", "Nugent", "Ortiz", "Orwig", "Ory", "Paiser", "Pak", "Pettigrew", "Quinn", "Quizoz", "Ramachandran", "Resnick", "Sagar", "Schickowski", "Schiebel", "Sellon", "Severson", "Shaffer", "Solberg", "Soloman", "Sonderling", "Soukup", "Soulis", "Stahl", "Sweeney", "Tandy", "Trebil", "Trusela", "Trussel", "Turco", "Uddin", "Uflan", "Ulrich", "Upson", "Vader", "Vail", "Valente", "Van Zandt", "Vanderpoel", "Ventotla", "Vogal", "Wagle", "Wagner", "Wakefield", "Weinstein", "Weiss", "Woo", "Yang", "Yates", "Yocum", "Zeaser", "Zeller", "Ziegler", "Bauer", "Baxster", "Casal", "Cataldi", "Caswell", "Celedon", "Chambers", "Chapman", "Christensen", "Darnell", "Davidson", "Davis", "DeLorenzo", "Dinkins", "Doran", "Dugelman", "Dugan", "Duffman", "Eastman", "Ferro", "Ferry", "Fletcher", "Fietzer", "Hylan", "Hydinger", "Illingsworth", "Ingram", "Irwin", "Jagtap", "Jenson", "Johnson", "Johnsen", "Jones", "Jurgenson", "Kalleg", "Kaskel", "Keller", "Leisinger", "LePage", "Lewis", "Linde", "Lulloff", "Maki", "Martin", "McGinnis", "Mills", "Moody", "Moore", "Napier", "Nelson", "Norquist", "Nuttle", "Olson", "Ostrander", "Reamer", "Reardon", "Reyes", "Rice", "Ripka", "Roberts", "Rogers", "Root", "Sandstrom", "Sawyer", "Schlicht", "Schmitt", "Schwager", "Schutz", "Schuster", "Tapia", "Thompson", "Tiernan", "Tisler"];
console.log(" test");
seeder();

app.on('listening', function () {
    console.log("endtered on listening");
    seeder();
});
 
async function seeder() {
    
        console.log("entered seeder");
        const client = await pool.connect();
        console.log("client connected");
        const usernames = [];
        const names = [];
        const genders = []
        const phoneNumbers = [];
        const emails = [];
        const sampleAddresses = [];
        const addresses = [];
        const creditCardNumbers = [];
        const creditCardExpiries = [];
        const file = readline.createInterface({
            input: fs.createReadStream('examplesampleAddresses'),
            output: process.stdout,
            terminal: false
        });
        file.on('line', (line) => {
            sampleAddresses.push(line);
        });

        let limit = 3000;
        for (var i = 0; i < limit; i++) {
            const index1 = Math.floor((Math.random() * FIRST_NAMES.length));
            const index2 = Math.floor((Math.random() * MIDDLE_NAMES.length));
            const index3 = Math.floor((Math.random() * LAST_NAMES.length));
            const username = FIRST_NAMES[index1] + "_" + MIDDLE_NAMES[index2] + "_" + LAST_NAMES[index3]
            const name = username;
            var gender = (Math.round( Math.random()) == 1) ? "Male":"Female";
            var phoneNumber = Math.round(Math.random()*10000000)
            var address = ""
            emailPart1 = ""
            emailpart2 = ""
            hosts = ["gmail.com","hotmail.com","yandex.com","protonmail.com","tutanota.com","yahoo.com.",
            "icloud.com","baidu.com","ryanisthebest.com"]
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (var i = 0; i < Math.random()*(10**Math.floor(Math.random()*6)); i++ ) {
               emailPart1 += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            emailPart2 += hosts[Math.floor(Math.random() * hosts.length)];
            email = emailPart1 + "@"+emailPart2
            address = sampleAddresses[Math.floor(Math.random() * sampleAddresses.length)];

            if (!usernames.includes(username) && !names.includes(name)&&!emails.includes(email)) {
                usernames.push(usernames);
                names.push(name);
                genders.push(gender);
                phoneNumbers.push(phoneNumber);
                emails.push(email);
                addresses.push(address);
            } else{
                limit++;
            }
        }

        limit2 = 1000;
        let today = new Date().toISOString().slice(0, 10);
        var fiveYearsFromNow = new Date();
        fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 1);
        
        for (var i = 0;i<limit2;i++){
            const creditCardNumber = Math.round(Math.random()*10**16)
            const expiryDate =  new Date(+today + Math.random() * (fiveYearsFromNow - today));

            if(!creditCardNumbers.includes(creditCardNumber)){
                creditCardNumbers.push(creditCardNumber)
                creditCardExpiries.push(expiryDate)
            }
        }

        //for pet owners
        for (var i = 0; i < limit/3; i++) {
            // TODO
            const userCreationQuery = "INSERT INTO user VALUES("+usernames[i]+",123,"+name[1]+"1999-01-08,"+
            genders[i]+","+phoneNumbers[i]+","+emails[i]+","+addresses[i]+")";
            const perOwnerCreationQuery = "INSERT INTO pet_owner VALUES ("+creditCardNumbers[i]+
            +","+names[i]+","+creditCardExpiries[i]+")";
            try{
                await client.query(userCreationQuery);
                await client.query(perOwnerCreationQuery);
            }catch (err) {
                console.err("init has already been created");
                console.error(err);
            }
        }

        client.release();
} 





