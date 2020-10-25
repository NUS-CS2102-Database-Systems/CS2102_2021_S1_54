-- run this to init database: cat seeder/sql_create_statements.sql | heroku pg:psql --app pet-care-service
DROP TABLE IF EXISTS animal_type, users, pet_owner, caretaker, full_time_caretaker, part_time_caretaker, 
	pet, bid_transaction, pcs_administrator, set_base_daily_price, can_take_care, daily_price_rate,
	availabilities, leave_days;

CREATE TABLE animal_type (
	type_name VARCHAR PRIMARY KEY
);

CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
	password VARCHAR NOT NULL,
	name VARCHAR NOT NULL,
	birth_date DATE NOT NULL,
	gender VARCHAR NOT NULL, 
	phone INT NOT NULL,
	email VARCHAR NOT NULL,
	address VARCHAR NOT NULL
);

CREATE TABLE pet_owner (
	username VARCHAR PRIMARY KEY REFERENCES users(username) ON DELETE cascade,
	credit_card_number CHAR(16),
	credit_card_full_name VARCHAR,
	credit_card_expiry_date VARCHAR(5)
);

CREATE TABLE caretaker (
    username VARCHAR PRIMARY KEY REFERENCES users(username) ON DELETE cascade,
    average_rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
	date_started DATE NOT NULL
);

CREATE TABLE full_time_caretaker (
    username VARCHAR PRIMARY KEY REFERENCES caretaker(username) ON DELETE cascade
);

CREATE TABLE part_time_caretaker (
    username VARCHAR PRIMARY KEY REFERENCES caretaker(username) ON DELETE cascade
);

CREATE TABLE pet (
	username VARCHAR NOT NULL  REFERENCES pet_owner(username) ON DELETE cascade,
	pet_name VARCHAR NOT NULL,
	birth_date DATE NOT NULL,
	breed VARCHAR NOT NULL,
	type_of_animal VARCHAR NOT NULL REFERENCES animal_type(type_name),
	gender VARCHAR NOT NULL, 
	med_hist VARCHAR NOT NULL,
	special_req VARCHAR NOT NULL,
	PRIMARY KEY (username, pet_name)
);

CREATE TABLE bid_transaction (
	pusername VARCHAR,
	pet_name VARCHAR,
	cusername VARCHAR REFERENCES caretaker(username),
    bidding_time TIMESTAMP NOT NULL,
	job_start_datetime TIMESTAMP,
	job_end_datetime TIMESTAMP,
    payment_datetime TIMESTAMP,
    daily_price_at_that_point NUMERIC(7, 2),
	amount NUMERIC(7, 2),
	payment_method VARCHAR ,
    start_transfer_method VARCHAR,
	end_transfer_method VARCHAR,
	is_successful_bid BOOLEAN,
    review_time TIMESTAMP,
    review VARCHAR,
    rating INT,
	FOREIGN KEY (pusername, pet_name) REFERENCES pet(username, pet_name),
	PRIMARY KEY (pusername, cusername, pet_name, job_start_datetime, job_end_datetime)
);

CREATE TABLE pcs_administrator (
	username VARCHAR PRIMARY KEY,
	password VARCHAR NOT NULL
);

CREATE TABLE set_base_daily_price (
	type_name VARCHAR PRIMARY KEY REFERENCES animal_type(type_name),
	base_daily_price INT NOT NULL,
	admin_username VARCHAR NOT NULL REFERENCES pcs_administrator(username)
);

CREATE TABLE can_take_care (
	username VARCHAR REFERENCES caretaker(username),
	type_name VARCHAR REFERENCES animal_type(type_name),
	PRIMARY KEY (username, type_name)
);

CREATE TABLE daily_price_rate(
	username VARCHAR REFERENCES caretaker(username),
	type_name VARCHAR REFERENCES  set_base_daily_price(type_name),
    base_daily_price INT NOT NULL,
	current_daily_price NUMERIC(7, 2) CHECK(current_daily_price >= base_daily_price),
	PRIMARY KEY(username, type_name)
);

CREATE TABLE availabilities(
	username VARCHAR REFERENCES part_time_caretaker(username),
	start_date DATE NOT NULL,
    end_date DATE NOT NULL,
	number_of_pets_allowed INTEGER NOT NULL,
	PRIMARY KEY(username, start_date, end_date)
);

CREATE TABLE leave_days(
	username VARCHAR NOT NULL REFERENCES full_time_caretaker(username),
    pcs_admin  VARCHAR NOT NULL REFERENCES pcs_administrator(username),
	reason_for_leave VARCHAR NOT NULL,
	isApproved BOOLEAN NOT NULL,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
    PRIMARY KEY(username, start_date, end_date)	
);
