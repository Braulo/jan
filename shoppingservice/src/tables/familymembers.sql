CREATE TABLE IF NOT EXISTS familymembers (
    family varchar(48) NOT NULL,
    member varchar(48) NOT NULL,
    role   int DEFAULT 0 NOT NULL
);