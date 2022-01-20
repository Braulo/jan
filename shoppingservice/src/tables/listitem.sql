CREATE TABLE IF NOT EXISTS listitem (
    id varchar(48) NOT NULL,
    owner varchar(48),
    family varchar(48),
    shoppinglist varchar(48),
    name varchar(255),
    count int default 1,
    done boolean default 0,

    PRIMARY KEY (id)
);