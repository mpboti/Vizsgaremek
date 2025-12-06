DROP DATABASE IF EXISTS music_player;
CREATE DATABASE music_player CHARACTER SET = "utf8" COLLATE = "utf8_hungarian_ci";
USE music_player;

DROP FUNCTION IF EXISTS password_encript;
CREATE FUNCTION password_encript(password VARCHAR(255))
RETURNS VARCHAR(255) DETERMINISTIC
RETURN SHA2(CONCAT(password, "titkositas"), 256);

CREATE TABLE bands(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    forming_year DATETIME
);

CREATE TABLE albums(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(900) NOT NULL,
    release_date DATETIME,
    album_pic VARCHAR(2000),
    band_id INT,
    FOREIGN KEY (band_id) REFERENCES bands(id)
);

CREATE TABLE mufajok(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE musics(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    release_date DATETIME,
    music_path VARCHAR(2000),
    album_id INT,
    mufaj_id INT,
    FOREIGN KEY (album_id) REFERENCES albums(id),
    FOREIGN KEY (mufaj_id) REFERENCES mufajok(id)
);

CREATE TABLE music_bands(
    id INT AUTO_INCREMENT PRIMARY KEY,
    music_id INT,
    band_id INT,
    FOREIGN KEY (music_id) REFERENCES musics(id),
    FOREIGN KEY (band_id) REFERENCES bands(id)
);

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    shade INT,
    user_pic VARCHAR(2000),
    last_played_id INT,
    FOREIGN KEY (last_played_id) REFERENCES musics(id)
);

DROP TRIGGER IF EXISTS password_secret;
CREATE TRIGGER password_secret BEFORE INSERT ON users
FOR EACH ROW SET new.password = password_encript(new.password);

CREATE TABLE playlists(
    id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT,
    name VARCHAR(100),
    FOREIGN KEY (creator_id) REFERENCES users(id)
);

CREATE TABLE playlist_musics(
    id INT AUTO_INCREMENT PRIMARY KEY,
    playlist_id INT,
    music_id INT,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id),
    FOREIGN KEY (music_id) REFERENCES musics(id)
);

CREATE TABLE playlist_mufajok(
    id INT AUTO_INCREMENT PRIMARY KEY,
    playlist_id INT,
    mufaj_id INT,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id),
    FOREIGN KEY (mufaj_id) REFERENCES mufajok(id)
);

INSERT INTO bands VALUES 
(NULL, "blur", "1988-01-01"), 
(NULL, "Guns N' Roses", "1985-01-01");

INSERT INTO albums VALUES 
(NULL, "Apatite for Deatructoin", "1987-01-01", "https://i.scdn.co/image/ab67616d00001e0221ebf49b3292c3f0f575f0f5", 2),
(NULL, "blur", "1997.01.01", "https://i.scdn.co/image/ab67616d00001e02de114203356c1f7b136960b6", 1);

INSERT INTO mufajok VALUES
(NULL, "rock and roll"),
(NULL, "pop");

INSERT INTO musics VALUES
(NULL, "Song 2 (2012 Remaster)", "1997-02-10", "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/ff/11/26/ff1126d1-d793-5107-39a9-5e57383b4e88/mzaf_14192975438031776859.plus.aac.p.m4a", 2, 1),
(NULL, "Welcome to the jungel", "1987-09-21", "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2c/3f/98/2c3f988e-14a5-3070-8fcb-23f1ac0f1dca/mzaf_14543602353110977845.plus.aac.p.m4a", 1, 2);

INSERT INTO music_bands VALUES
(NULL, 2, 2),
(NULL, 1, 1);

INSERT INTO users VALUES
(NULL, "mpboti", "asdasd@gmail.com", "asdasd123", 7, "https://i.scdn.co/image/ab67757000003b82a81ce3d87efdd7f1dcd56853", 1);

INSERT INTO playlists VALUES
(NULL, 1, "jó zenék");

INSERT INTO playlist_musics VALUES
(NULL, 1, 1),
(NULL, 1, 2);

INSERT INTO playlist_mufajok VALUES
(NULL, 1, 1);