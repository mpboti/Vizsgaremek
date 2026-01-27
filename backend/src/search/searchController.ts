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
        console.error("Error fetching musics:", error);
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
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}