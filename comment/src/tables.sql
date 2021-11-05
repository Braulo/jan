CREATE TABLE IF NOT EXISTS comments (
    id varchar(128) NOT NULL,
    owner varchar(256),
    path varchar(512) NOT NULL,
    content text,

    PRIMARY KEY (id)
)
