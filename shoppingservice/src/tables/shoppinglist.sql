CREATE TABLE IF NOT EXISTS shoppinglist (
    id varchar(48) NOT NULL,
    owner varchar(48),
    family varchar(48),
    thumbnail varchar(48),
    title varchar(512),
    status int default 0,

    PRIMARY KEY (id)
);