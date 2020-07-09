CREATE TABLE pets (
	-- columns to be defined in this table
	-- column_name column_type CONSTRAINTS,	
--	id SERIAL PRIMARY KEY, -- Very common mechanism for auto incrementing
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- newer mechanism
	name VARCHAR(50),
	birthdate DATE
);

CREATE TABLE people (
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	birthdate DATE
);

CREATE TABLE pet_dishbowl(
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	capacity INTEGER NOT NULL,
	amount INTEGER NOT NULL,
	pet_id INTEGER REFERENCES pets (id) UNIQUE,
	CHECK (amount <= capacity AND amount >= 0)
);


CREATE TABLE credit_cards(
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	balance MONEY,
	credit_limit MONEY,
	owner_id INTEGER REFERENCES people (id) NOT NULL,
	CHECK (balance <= credit_limit)
);

CREATE TABLE pet_owners (
	people_id integer REFERENCES people (id),
	pets_id integer REFERENCES pets (id),
	PRIMARY KEY (people_id, pets_id)
);


-- We want to add birthdate.  What would the appropriate type be for birthdate?
-- ALTER TABLE pets ADD COLUMN birthdate DATE;

DROP TABLE credit_cards;

DROP TABLE pets;

CREATE TABLE IF NOT EXISTS pets (
    -- columns to be defined in this table
    -- column_name column_type CONSTRAINTS, 
--  id SERIAL PRIMARY KEY, -- Very common mechanism for auto incrementing
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- newer mechanism
    name VARCHAR(50),
    birthdate DATE
);
CREATE TABLE IF NOT EXISTS people (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    birthdate DATE,
    best_friend INTEGER REFERENCES people(id)
);
CREATE TABLE IF NOT EXISTS pet_dishbowl(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    capacity INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    pet_id INTEGER REFERENCES pets (id) UNIQUE,
    CHECK (amount <= capacity AND amount >= 0)
);
CREATE TABLE IF NOT EXISTS credit_cards(
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    balance MONEY,
    credit_limit MONEY,
    owner_id INTEGER REFERENCES people (id) NOT NULL,
    CHECK (balance <= credit_limit)
);
CREATE TABLE IF NOT EXISTS pet_owners (
    people_id integer REFERENCES people (id),
    pets_id integer REFERENCES pets (id),
    PRIMARY KEY (people_id, pets_id)
);
DO $$
BEGIN
  CREATE ROLE node_app_role LOGIN PASSWORD 'p4ssw0rd';
  EXCEPTION WHEN DUPLICATE_OBJECT THEN
  RAISE NOTICE 'not creating role my_role -- it already exists';
END
$$;
GRANT INSERT, SELECT, UPDATE ON TABLE pet_owners TO node_app_role;
GRANT INSERT, SELECT, UPDATE ON TABLE people TO node_app_role;
GRANT INSERT, SELECT, UPDATE ON TABLE pets TO node_app_role;
GRANT INSERT, SELECT, UPDATE ON TABLE credit_cards TO node_app_role;
GRANT INSERT, SELECT, UPDATE ON TABLE pet_dishbowl TO node_app_role;