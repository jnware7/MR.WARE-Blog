
DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
id  SERIAL,
title TEXT,
sub_title TEXT,
post TEXT,
writer TEXT NOT NULL DEFAULT 'MR. WARE',
post_time TIMESTAMP DEFAULT NOW(),
PRIMARY KEY (id)
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
id  SERIAL,
user_name VARCHAR,
password VARCHAR,
PRIMARY KEY (id)
);

DROP TABLE IF EXISTS images;
CREATE TABLE images (
id  SERIAL,
posts_id INTEGER,
img VARCHAR,
PRIMARY KEY (id)
);

ALTER TABLE images ADD FOREIGN KEY (posts_id) REFERENCES posts (id);

INSERT INTO users (user_name,password) VALUES('JeffreyW','$2a$12$q4hobCV0cpxxSC6vTglGnu.d6TkRVGo5dEtyCDSBy5F6Vu7S3FsfK')
