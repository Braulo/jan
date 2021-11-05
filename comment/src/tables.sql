CREATE TABLE IF NOT EXISTS comments (
    id int NOT NULL AUTO_INCREMENT,
    owner int,
    path varchar(512) NOT NULL,
    content text,

    PRIMARY KEY (id)
)
