import { Request, Response } from "express";
import config from "../config/config";
import { Playlist, IPlaylist, PlaylistMusics, IPlaylistMusics} from "../classes/playlist";

export async function getAllPlaylists(_req: Request, res: Response) {
    const conn = await config.connection;
    try {
        const [results] = await conn.query("SELECT * FROM playlists");
        if (results.length === 0) {
            res.status(404).json({ message: "No playlists found." });
            return;
        }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
        return;
    }
    return;
};

export async function getPlaylistByUserId(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string);
    const conn = await config.connection;
    try {
        const [results] = await conn.query("SELECT * FROM playlists WHERE ownerId = ?", [id]);
        if (results.length === 0) {
            res.status(300).json({ message: "No playlists found for this user." });
            return;
        }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
        return;
    }
    return;
};

export async function getPlaylistById(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid playlist ID." });
    }
    const conn = await config.connection;
    try {
        const [results] = await conn.query("SELECT * FROM playlists WHERE id = ?", [id]);
        if (results.length === 0) {
            res.status(404).json({ message: "Playlist not found." });
            return;
        }
        const [musics] = await conn.query("SELECT musicId, position FROM playlist_musics WHERE playlistId = ?", [id]);
        res.status(200).json({ ...results[0], musics });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
        return;
    }
    return;
};

export async function createPlaylist(req: Request, res: Response) {
    if(!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }
    const playlist = new Playlist(req.body as unknown as IPlaylist);
    if (playlist.name === undefined || playlist.creatorId === undefined ||
        playlist.name === null || playlist.creatorId === null ||
        playlist.name === "") {
        return res.status(400).json({ message: "Invalid playlist data." });
    }
    const conn = await config.connection;
    try  {
        const [results] = await conn.query("INSERT INTO playlists (id, name, creatorId) VALUES (null, ?, ?)", [playlist.name, playlist.creatorId]);
        res.status(201).json({ message: "Playlist created successfully.", id: results.insertId });
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function addMusicToPlaylist(req: Request, res: Response) {
    if(!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }

    const playlistId: number = parseInt(req.params.playlistId as string);
    const musicId: number = parseInt(req.params.musicId as string);

    if (isNaN(playlistId) || isNaN(musicId)) {
        return res.status(400).json({ message: "Invalid playlist ID or music ID." });
    }
    
    const playlistMusic = new PlaylistMusics(req.body as unknown as IPlaylistMusics);
    if (playlistMusic.playlistId === undefined || playlistMusic.musicId === undefined || playlistMusic.position === undefined ||
        playlistMusic.playlistId === null || playlistMusic.musicId === null || playlistMusic.position === null) {
        return res.status(400).json({ message: "Invalid playlist music data." });
    }
    const conn = await config.connection;
    try  {
        await conn.query("INSERT INTO playlist_musics (playlistId, musicId, position) VALUES (?, ?, ?)", [playlistMusic.playlistId, playlistMusic.musicId, playlistMusic.position]);
        res.status(201).json({ message: "Music added to playlist successfully." });
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function removeMusicFromPlaylist(req: Request, res: Response) {
    const playlistId: number = parseInt(req.params.playlistId as string);
    const musicId: number = parseInt(req.params.musicId as string);
    if (isNaN(playlistId) || isNaN(musicId)) {
        return res.status(400).json({ message: "Invalid playlist ID or music ID." });
    }
    const conn = await config.connection;
    try  {
        const [results] = await conn.query("DELETE FROM playlist_musics WHERE playlistId = ? AND musicId = ?", [playlistId, musicId]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Music not found in playlist." });
            return;
        }
        res.status(200).json({ message: "Music removed from playlist successfully." });
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function deletePlaylist(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid playlist ID." });
    }
    const conn = await config.connection;
    try {
        const [results] = await conn.query("DELETE FROM playlists WHERE id = ?", [id]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Playlist not found." });
            return;
        }
        res.status(200).json({ message: "Playlist deleted successfully." });
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function updatePlaylist(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid playlist ID." });
    }
    if(!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }
    const playlist = new Playlist(req.body as unknown as IPlaylist);
    if (playlist.name === undefined || playlist.creatorId === undefined ||
        playlist.name === null || playlist.creatorId === null ||
        playlist.name === "") {
        return res.status(400).json({ message: "Invalid playlist data." });
    }
    const conn = await config.connection;
    try {
        const [results] = await conn.query("UPDATE playlists SET name = ? WHERE id = ?", [playlist.name, id]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Playlist not found." });
            return;
        }
        res.status(200).json({ message: "Playlist updated successfully." });
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};