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
    -- daily_price_at_that_point NUMERIC(7, 2),
	amount NUMERIC(7, 2),
	payment_method VARCHAR ,
    start_transfer_method VARCHAR,
	end_transfer_method VARCHAR,
	is_successful_bid BOOLEAN,
    review_time TIMESTAMP,
    review VARCHAR,
    rating INT,
	FOREIGN KEY (pusername, pet_name) REFERENCES pet(username, pet_name),
	PRIMARY KEY (pusername, cusername, pet_name, job_start_datetime, job_end_datetime),
	CHECK (job_end_datetime >= job_start_datetime),
	CHECK (payment_datetime <= job_start_datetime),
	CHECK (bidding_time <= payment_datetime)
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
	type_name VARCHAR REFERENCES set_base_daily_price(type_name),
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
 
-- trigger 1
CREATE OR REPLACE FUNCTION not_overlap()
	RETURNS TRIGGER AS 
	$$ DECLARE ctx1 NUMERIC; ctx2 NUMERIC; part_time_exists BOOLEAN;
	BEGIN 
		part_time_exists := (SELECT EXISTS (SELECT 1 FROM part_time_caretaker WHERE username = NEW.username));

		IF part_time_exists = ‘t’ THEN
			SELECT COUNT(*) INTO ctx1 FROM availabilities A
			WHERE NEW.cusername = A.username AND 
			(NEW.job_start_datetime >= A.start_date AND NEW.job_end_datetime <= A.end_date);

			IF ctx1 = 0 THEN
				RETURN NULL;
			ELSE
				RETURN NEW;
			END IF;

		ELSE
		SELECT COUNT(*) INTO ctx2 FROM leave_days L
		WHERE NEW.cusername = L.username AND
		(job_start_datetime, job_end_datetime) overlaps (L.start_date, L.end_date);

		IF ctx2 > 0 THEN
			RETURN NULL;
		ELSE
			RETURN NEW;
		END IF;

	END IF; END; $$
LANGUAGE plpgsql;

CREATE TRIGGER check_overlap
BEFORE INSERT OR UPDATE ON bid_transaction
FOR EACH ROW EXECUTE PROCEDURE not_overlap();

-- trigger 2
CREATE OR REPLACE FUNCTION update_avg_rating_of_caretaker()
 RETURNS TRIGGER
AS $$
	DECLARE avg_rating NUMERIC;
	BEGIN
IF NEW.rating IS NOT NULL AND OLD.rating IS NULL THEN
	avg_rating := (SELECT AVG(rating) FROM bid_transaction WHERE username = NEW.username);
UPDATE caretaker SET average_rating = avg_rating WHERE cusername = NEW.username;
END IF;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER update_avg_rating
AFTER UPDATE ON bid_transaction
FOR EACH ROW EXECUTE FUNCTION update_avg_rating_of_caretaker();

-- trigger 3
CREATE OR REPLACE FUNCTION update_part_time_pet_limit()
 RETURNS TRIGGER
AS $$
	DECLARE part_time_exists BOOLEAN;
	BEGIN
		IF NEW.average_rating != OLD.average_rating THEN
			part_time_exists := (SELECT EXISTS (SELECT 1 FROM part_time_caretaker WHERE username = NEW.username));

			IF part_time_exists = ‘t’ THEN
				IF NEW.average_rating >= 4.0 THEN
					UPDATE availabilities SET number_of_pets_allowed = 4 WHERE username = NEW.username AND start_date >= current_date;
				ELSIF NEW.average_rating < 4.0 THEN
					UPDATE availabilities SET number_of_pets_allowed = 2 WHERE username = NEW.username AND start_date >= current_date;
				END IF;
			END IF;
		END IF;
	END; $$
LANGUAGE plpgsql;

CREATE TRIGGER update_part_time_max_pet
AFTER UPDATE ON caretaker
FOR EACH ROW EXECUTE FUNCTION update_part_time_pet_limit();

-- trigger 4
CREATE OR REPLACE FUNCTION new_current_daily_price_rate()
 RETURNS TRIGGER
AS $$
DECLARE price_increase NUMERIC;
	BEGIN
	IF NEW.average_rating != OLD.average_rating THEN
			
		IF NEW.average_rating <= 2.0 THEN
		UPDATE daily_price_rate d
		SET d.current_daily_price = base_daily_price
		FROM can_take_care NATURAL JOIN set_base_daily_price
		WHERE username = NEW.username AND d.username = NEW.username  AND d.type_name =  type_name;

		ELSE
			price_increase := ((NEW.average_rating - 2.0)/0.5) * 10;
			UPDATE daily_price_rate d
			SET d.current_daily_price = base_daily_price + price_increase
			FROM can_take_care NATURAL JOIN set_base_daily_price
			WHERE username = NEW.username AND d.username = NEW.username  AND d.type_name =  type_name;
		END IF;
	END IF;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER update_daily_price
AFTER UPDATE ON caretaker
FOR EACH ROW EXECUTE FUNCTION new_current_daily_price_rate();


-- trigger 5
CREATE OR REPLACE FUNCTION check_caretaker_pet_limit()
 RETURNS TRIGGER
AS $$
	DECLARE num_pets INT;
	DECLARE part_time_pets INT;
	DECLARE part_time_exists BOOLEAN;
	DECLARE full_time_exists BOOLEAN;
	BEGIN
		SELECT COUNT(*) INTO num_pets FROM bid_transaction WHERE cusername = NEW.cusername AND (job_start_datetime, job_end_datetime) OVERLAPS (NEW.job_start_datetime, NEW.job_end_datetime);
		
		full_time_exists := (SELECT EXISTS (SELECT 1 FROM full_time_caretaker WHERE username = NEW.cusername));

		part_time_exists := (SELECT EXISTS (SELECT 1 FROM part_time_caretaker WHERE username = NEW.cusername));

		IF full_time_exists = ‘t’ THEN 
			IF num_pets >= 5 THEN
				RETURN NULL;
			ELSIF num_pets < 5 THEN
				RETURN NEW;
			END IF;
		ELSIF part_time_exists = ‘t’ THEN
			SELECT number_of_pets_allowed INTO part_time_pets FROM availabilities WHERE username = NEW.cusername ORDER BY start_date DESC LIMIT 1;
			IF num_pets >= part_time_pets THEN
				RETURN NULL;
			ELSIF num_pets < part_time_pets THEN
				RETURN NEW;
			END IF;
		END IF;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER check_pet_limit
BEFORE INSERT ON bid_transaction
FOR EACH ROW EXECUTE FUNCTION check_caretaker_pet_limit();


-- trigger 6
CREATE OR REPLACE FUNCTION not_full_time()
	RETURNS TRIGGER AS 
		$$ DECLARE ctx NUMERIC;
		BEGIN 
		SELECT COUNT(*) INTO ctx FROM full_time_caretaker F
		WHERE NEW.username = F.username;
		IF ctx > 0 THEN
			RETURN NULL;
		ELSE
			RETURN NEW;
	END IF; END; $$
LANGUAGE plpgsql;

CREATE TRIGGER check_part_time_caretaker
BEFORE INSERT OR UPDATE ON part_time_caretaker
FOR EACH ROW EXECUTE PROCEDURE not_full_time();

CREATE OR REPLACE FUNCTION not_part_time()
	RETURNS TRIGGER AS 
	$$ DECLARE ctx NUMERIC;
	BEGIN 
		SELECT COUNT(*) INTO ctx FROM part_time_caretaker P
		WHERE NEW.username = P.username;
			IF ctx > 0 THEN
				RETURN NULL;
			ELSE
				RETURN NEW;
			END IF; 
	END; $$
LANGUAGE plpgsql;

CREATE TRIGGER check_full_time_caretaker
BEFORE INSERT OR UPDATE ON full_time_caretaker
FOR EACH ROW EXECUTE PROCEDURE not_part_time();

-- trigger 7
CREATE OR REPLACE FUNCTION change_current_daily_price()
	RETURNS TRIGGER AS
$$ DECLARE price_change NUMERIC;
	BEGIN
	IF NEW.base_daily_price != OLD.base_daily_price THEN
		price_change := NEW.base_daily_price - OLD.base_daily_price;
		UPDATE daily_price_rate d
		SET d.current_daily_price = d.current_daily_price + price_change
		WHERE d.type_name = NEW.type_name;
	END IF;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER update_current_daily_price
AFTER UPDATE ON set_base_daily_price
FOR EACH ROW EXECUTE FUNCTION change_current_daily_price();