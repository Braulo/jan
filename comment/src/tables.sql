CREATE TABLE IF NOT EXISTS comments (
    id varchar(48) NOT NULL,
    owner varchar(48),
    path varchar(512) NOT NULL,
    content text,
    image varchar(48),

    PRIMARY KEY (id)
)
