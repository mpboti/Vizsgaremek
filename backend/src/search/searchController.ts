import { Request, Response } from "express";
import config from "../config/config";

export async function searchMusicsByName(req: Request, res: Response) {
    const conn = await config.connection;

    try {
        const [results] = await conn.query("SELECT * FROM musics WHERE name LIKE ?", [`%${req.query.name}%`]);
        if (results.length === 0) {
                res.status(404).json({ message: "No musics found." });
            }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function searchUsersByUsername(req: Request, res: Response) {
    const conn = await config.connection;

    try {
        const [results] = await conn.query("SELECT * FROM users WHERE username LIKE ?", [`%${req.query.username}%`]);
        if (results.length === 0) {
                res.status(404).json({ message: "No users found." });
            }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function searchPlaylistsByName(req: Request, res: Response) {
    const conn = await config.connection;
    
    try {
        const [results] = await conn.query("SELECT * FROM playlists WHERE name LIKE ?", [`%${req.query.name}%`]);
        if (results.length === 0) {
            res.status(404).json({ message: "No playlists found." });
        }
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching playlists:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function searchPlaylistsByNameOfCreatorId(req: Request, res: Response) {
    const conn = await config.connection;
    
    try {
        const [results] = await conn.query("SELECT * FROM playlists WHERE playlists.creatorId = ? AND playlists.name LIKE ?", [req.query.creatorId, `%${req.query.name}%`]);
        if (results.length === 0) {
            res.status(404).json({ message: "No playlists found." });
        }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
}