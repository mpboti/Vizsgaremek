CREATE DATABASE slicetune;
USE slicetune;

CREATE TABLE profile_pictures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fileName VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mimeType VARCHAR(100),
    filePath VARCHAR(500) NOT NULL
);

CREATE TABLE music_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fileName VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mimeType VARCHAR(100),
    filePath VARCHAR(500) NOT NULL
);

--If profile picture gets deleted avatarId is set to null
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    pwd VARCHAR(255) NOT NULL,
    avatarId INT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (avatarId) REFERENCES profile_pictures(id) ON DELETE SET NULL
);

--if the user or the music file gets deleted, the music deletes itself too
CREATE TABLE musics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    musicFileId INT NOT NULL,
    uploaderId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (musicFileId) REFERENCES music_files(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaderId) REFERENCES users(id) ON DELETE CASCADE
);

--if user gets deleted, the playlist does too
CREATE TABLE playlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ownerId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE
);

--if the playlist. or the music in the playlist gets deleted, so does it's place in the playlist
CREATE TABLE playlist_musics (
    playlistId INT NOT NULL,
    musicId INT NOT NULL,
    position INT NOT NULL,
    addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlistId, musicId),
    UNIQUE (playlistId, position),
    FOREIGN KEY (playlistId) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (musicId) REFERENCES musics(id) ON DELETE CASCADE
);

--Before we insert the user in the users table, we encrypt the password
CREATE TRIGGER insert_user BEFORE INSERT ON users
FOR EACH ROW SET new.pwd = pwd_encrypt(new.pwd);

CREATE FUNCTION pwd_encrypt(pwd VARCHAR(100))
RETURNS VARCHAR(255) DETERMINISTIC
RETURN SHA2(CONCAT(pwd,'poopastinka'),256);

--We check if the email and password match
DELIMITER $$

CREATE FUNCTION login(email VARCHAR(100),pwd VARCHAR(100))
RETURNS INTEGER DETERMINISTIC
BEGIN
DECLARE ok INTEGER;
SET ok = 0;
SELECT userId INTO ok FROM users WHERE users.email = email AND users.password = pwd_encrypt(pwd);
RETURN ok;

DELIMITER ;