CREATE TABLE IF NOT EXISTS family (
    id varchar(48) NOT NULL,
    title varchar(128),
    image varchar(48),

    PRIMARY KEY (id)
);

CREATE TABLE familymembers (
    family varchar(48) NOT NULL,
    member varchar(48) NOT NULL
);

CREATE TABLE IF NOT EXISTS shoppinglist (
    id varchar(48) NOT NULL,
    owner varchar(48),
    family varchar(48),
    thumbnail varchar(48)
    title varchar(512),
    status int default 0,

    PRIMARY KEY (id)
);
