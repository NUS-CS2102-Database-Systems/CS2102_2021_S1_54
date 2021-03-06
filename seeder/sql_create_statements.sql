-- run this to init database: cat seeder/file_name.sql | heroku pg:psql --app pet-care-service
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
   credit_card_number VARCHAR UNIQUE,
   credit_card_full_name VARCHAR,
   credit_card_expiry_date VARCHAR(5),
   CHECK ((credit_card_number IS NULL AND credit_card_full_name IS NULL 
   			AND credit_card_expiry_date IS NULL) 
   OR (credit_card_number IS NOT NULL AND credit_card_full_name IS NOT NULL 
   		AND credit_card_expiry_date IS NOT NULL))
);

CREATE TABLE caretaker (
    username VARCHAR PRIMARY KEY REFERENCES users(username) ON DELETE cascade,
    average_rating NUMERIC(2, 1) NOT NULL DEFAULT 0.0,
	date_started DATE NOT NULL
);

CREATE TABLE full_time_caretaker (
    username VARCHAR PRIMARY KEY REFERENCES caretaker(username) ON DELETE cascade
);

CREATE TABLE part_time_caretaker (
    username VARCHAR PRIMARY KEY REFERENCES caretaker(username) ON DELETE cascade
);

CREATE TABLE pet (
	username VARCHAR NOT NULL REFERENCES pet_owner(username) ON DELETE cascade,
	pet_name VARCHAR NOT NULL,
	birth_date DATE NOT NULL,
	breed VARCHAR NOT NULL,
	type_of_animal VARCHAR NOT NULL REFERENCES animal_type(type_name),
	gender VARCHAR NOT NULL, 
	med_hist VARCHAR,
	special_req VARCHAR,
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
	number_of_pets_allowed INTEGER NOT NULL ,
	PRIMARY KEY (username, start_date, end_date),
	CHECK (number_of_pets_allowed = 2 OR number_of_pets_allowed = 4)
);

CREATE TABLE leave_days(
	username VARCHAR NOT NULL REFERENCES full_time_caretaker(username),
	reason_for_leave VARCHAR NOT NULL,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
    PRIMARY KEY(username, start_date, end_date),
	CHECK (start_date <= end_date)
);

CREATE VIEW pet_days_per_job(cusername, pet_days, job_end_datetime) AS (
	SELECT cusername, DATE_PART('DAY', job_end_datetime - job_start_datetime) + 1 AS pet_days, job_end_datetime
	FROM bid_transaction
);

-- Modified pet_days_past_30_days, so job_end_datetime is less than or equal to time now in SGT
CREATE VIEW pet_days_past_30_days(cusername,pet_days) AS (
	SELECT cusername, SUM(pet_days)
	FROM pet_days_per_job
	WHERE job_end_datetime >= DATE_TRUNC('MONTH', NOW()) AND job_end_datetime <=  (SELECT (now() at time zone 'sgt'))
	GROUP BY cusername
);

--Modified salary_calculation
CREATE VIEW salary_calculation_for_full_time (cusername, salary) AS (
	SELECT F.username, CASE
		WHEN PD.pet_days <= 60 OR PD.pet_days IS NULL THEN 3000
		ELSE 3000 + (PD.pet_days - 60) * (SELECT AVG(current_daily_price) FROM daily_price_rate DPR WHERE DPR.username = F.username) * 0.8
		END AS salary
	FROM full_time_caretaker F LEFT JOIN pet_days_past_30_days PD ON F.username = PD.cusername
);

--Modified salary calculation
CREATE VIEW salary_calculation_for_part_time(cusername, salary) AS (
	SELECT P.username, COALESCE(((SELECT AVG(current_daily_price) FROM daily_price_rate DPR WHERE DPR.username = P.username) * PD.pet_days * 0.75), 0)
	FROM part_time_caretaker P LEFT JOIN pet_days_past_30_days PD ON P.username = PD.cusername
);

-- trigger 1
CREATE OR REPLACE FUNCTION not_overlap()
	RETURNS TRIGGER AS 
	$$ DECLARE ctx1 NUMERIC; ctx2 NUMERIC; part_time_exists BOOLEAN; leave_start DATE; leave_end DATE;
	BEGIN 
		part_time_exists := (SELECT EXISTS (SELECT 1 FROM part_time_caretaker WHERE username = NEW.cusername));

		IF part_time_exists THEN
			SELECT COUNT(*) INTO ctx1 FROM availabilities A
			WHERE NEW.cusername = A.username AND 
			(NEW.job_start_datetime >= A.start_date AND NEW.job_end_datetime <  (A.end_date + INTERVAL '1 day') );

			IF ctx1 = 0 THEN
				-- Replaced RETURN NULL with RAISE EXCEPTION
				RAISE EXCEPTION 'We regret to inform you that % is unavailable from % to %', NEW.cusername, NEW.job_start_datetime, NEW.job_end_datetime;
			ELSE
				RETURN NEW;
			END IF;

		ELSE
		SELECT COUNT(*) INTO ctx2 FROM leave_days L
		WHERE NEW.cusername = L.username AND
			(NEW.job_start_datetime, NEW.job_end_datetime) overlaps (L.start_date, (L.end_date + INTERVAL '1 day') );

		IF ctx2 > 0 THEN
			-- Replaced RETURN NULL with RAISE EXCEPTION
			SELECT L.start_date, L.end_date INTO leave_start, leave_end 
			FROM leave_days L
			WHERE NEW.cusername = L.username AND
				(NEW.job_start_datetime, NEW.job_end_datetime) overlaps (L.start_date, (L.end_date + INTERVAL '1 day') )
			LIMIT 1;
			RAISE EXCEPTION 'We regret to inform you that % will be on leave from % to %.', NEW.cusername, leave_start, leave_end;
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
	avg_rating := (SELECT AVG(rating) FROM bid_transaction B WHERE B.cusername = NEW.cusername);
	IF avg_rating IS NOT NULL THEN
		UPDATE caretaker SET average_rating = avg_rating WHERE username = NEW.cusername;
	END IF;
	RETURN NULL;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER update_avg_rating
AFTER INSERT OR UPDATE ON bid_transaction
FOR EACH ROW EXECUTE FUNCTION update_avg_rating_of_caretaker();

-- trigger 3
CREATE OR REPLACE FUNCTION update_part_time_pet_limit()
 RETURNS TRIGGER
AS $$
	DECLARE part_time_exists BOOLEAN;
	BEGIN
		IF NEW.average_rating != OLD.average_rating THEN
			part_time_exists := (SELECT EXISTS (SELECT 1 FROM part_time_caretaker WHERE username = NEW.username));

			IF part_time_exists THEN
				IF NEW.average_rating >= 4.0 THEN
					UPDATE availabilities SET number_of_pets_allowed = 4 WHERE username = NEW.username AND end_date >= current_date;
				ELSIF NEW.average_rating < 4.0 THEN
					UPDATE availabilities SET number_of_pets_allowed = 2 WHERE username = NEW.username AND end_date >= current_date;
				END IF;
			END IF;
		END IF;
		RETURN NULL;
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
		UPDATE daily_price_rate
		SET current_daily_price = S.base_daily_price
		FROM can_take_care AS C NATURAL JOIN set_base_daily_price AS S
		WHERE C.username = NEW.username AND daily_price_rate.username = NEW.username AND daily_price_rate.type_name = S.type_name;

		ELSE
			price_increase := ((NEW.average_rating - 2.0)/0.5) * 10;
			UPDATE daily_price_rate
			SET current_daily_price = S.base_daily_price + price_increase
			FROM can_take_care AS C NATURAL JOIN set_base_daily_price AS S
			WHERE C.username = NEW.username AND daily_price_rate.username = NEW.username AND daily_price_rate.type_name = S.type_name;
		END IF;
	END IF;
	RETURN NULL;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER update_daily_price
AFTER UPDATE ON caretaker
FOR EACH ROW EXECUTE FUNCTION new_current_daily_price_rate();

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
		UPDATE daily_price_rate
		SET current_daily_price = current_daily_price + price_change
		WHERE daily_price_rate.type_name = NEW.type_name;
	END IF;
	RETURN NULL;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER update_current_daily_price
AFTER UPDATE ON set_base_daily_price
FOR EACH ROW EXECUTE FUNCTION change_current_daily_price();

-- trigger 8
CREATE OR REPLACE FUNCTION check_leave_day_overlap()
	RETURNS TRIGGER AS
$$ DECLARE num_overlap_jobs NUMERIC; num_overlap_leaves NUMERIC;
	BEGIN
	SELECT COUNT(*) INTO num_overlap_jobs 
		FROM bid_transaction B
		WHERE B.cusername = NEW.username AND 
			((B.job_start_datetime, B.job_end_datetime) OVERLAPS (NEW.start_date, NEW.end_date));
	
	SELECT COUNT(*) INTO num_overlap_leaves
		FROM leave_days L
		WHERE L.username = NEW.username AND
			((L.start_date, L.end_date) OVERLAPS (NEW.start_date, NEW.end_date));

		IF num_overlap_jobs = 0 AND num_overlap_leaves = 0 THEN
			RETURN NEW;
		ELSE 
			RETURN NULL;
		END IF;
	END;$$
LANGUAGE plpgsql;

CREATE TRIGGER check_leave_day_validity
BEFORE INSERT OR UPDATE ON leave_days
FOR EACH ROW EXECUTE FUNCTION check_leave_day_overlap();

-- trigger 9
CREATE OR REPLACE FUNCTION new_daily_price_rate()
 RETURNS TRIGGER
AS $$
DECLARE base_price_rate NUMERIC;
	BEGIN
	SELECT base_daily_price INTO base_price_rate --Only 1 base_daily_price per animal type
		FROM set_base_daily_price 
		WHERE type_name = NEW.type_name;

	INSERT INTO daily_price_rate VALUES (NEW.username, NEW.type_name, base_price_rate);
	RETURN NEW;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER add_daily_price
AFTER INSERT ON can_take_care -- At the moment, cannot edit can_take_care and hence does not care about update
FOR EACH ROW EXECUTE FUNCTION new_daily_price_rate();
