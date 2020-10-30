-- run this to init database: cat seeder/sql_create_statements.sql | heroku pg:psql --app pet-care-service
DROP TABLE IF EXISTS animal_type, users, pet_owner, caretaker, full_time_caretaker, part_time_caretaker, 
	pet, bid_transaction, pcs_administrator, set_base_daily_price, can_take_care, daily_price_rate,
	availabilities, leave_days CASCADE;

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
	current_daily_price NUMERIC(7, 2),
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
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
    PRIMARY KEY(username, start_date, end_date)	
);

-- CREATE VIEW pet_days_past_30_days(cusername,pet_days) AS
-- 	(SELECT cusername, SUM(days)
-- 	FROM  bid_transaction
-- 	GROUP BY cusername
-- 	WHERE (SELECT (date_trunc('MONTH', (CURRENT_DATE)::date) + INTERVAL '1 MONTH - 1 day')::DATE AS last_date_of_month) AND (SELECT date_trunc('MONTH',now())::DATE AS first_date_month) AND 
-- 		CASE 
-- 	   		WHEN EXTRACT(MONTH FROM last_date_of_month) = EXTRACT(MONTH FROM job_start_datetime) AND EXTRACT(MONTH FROM last_date_of_month) = EXTRACT(MONTH FROM job_end_datetime) 
--    				THEN DATE(SUBSTRING(job_end_datetime FROM 1 FOR 10)) - DATE(SUBSTRING(job_start_datetime FROM 1 FOR 10))
--    			WHEN EXTRACT(MONTH FROM last_date_of_month) = EXTRACT(MONTH FROM job_start_datetime) AND  EXTRACT(MONTH FROM last_date_of_month) != EXTRACT(MONTH FROM job_end_datetime) 
-- 				THEN  last_date_of_month - DATE(SUBSTRING(job_start_datetime FROM 1 FOR 10))
-- 			WHEN EXTRACT(MONTH FROM first_date_of_month) != EXTRACT(MONTH FROM job_start_datetime) AND EXTRACT(MONTH FROM first_date_of_month) = EXTRACT(MONTH FROM job_end_datetime) 
-- 				THEN DATE(SUBSTRING(job_end_datetime FROM 1 FOR 10)) - first_date_of_month 
-- 	END AS days
-- );

CREATE VIEW pet_days_per_job(cusername, pet_days, job_end_datetime) AS (
	SELECT cusername, DATE_PART('DAY', job_end_datetime - job_start_datetime) AS pet_days, job_end_datetime
	FROM bid_transaction
);

CREATE VIEW pet_days_past_30_days(cusername,pet_days) AS (
	SELECT cusername, SUM(pet_days)
	FROM pet_days_per_job
	WHERE job_end_datetime >= DATE_TRUNC('MONTH', NOW()) AND job_end_datetime <=  DATE_TRUNC('DAY'  , NOW())
	GROUP BY cusername
);

CREATE VIEW salary_calculation_for_full_time (cusername, salary) AS (
	SELECT DPR.username, CASE
		WHEN PD.pet_days <= 60 THEN 3000
		ELSE 3000 + (PD.pet_days - 60) * (SELECT AVG(current_daily_price) FROM daily_price_rate WHERE username = DPR.username) * 0.8
		END AS salary
	FROM daily_price_rate DPR NATURAL JOIN pet_days_past_30_days PD 
);

CREATE VIEW salary_calculation_for_part_time (cusername, salary) AS (
	SELECT DPR.username, ((SELECT AVG(current_daily_price) FROM daily_price_rate WHERE username = DPR.username) * PD.pet_days * 0.75)
	FROM daily_price_rate DPR NATURAL JOIN pet_days_past_30_days PD
);



