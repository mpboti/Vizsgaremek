import { Request, Response } from "express";
import config from "../config/config";
import Music, {IMusic} from "./musics";

export async function getAllMusics(_req: Request, res: Response) {
    const conn = await config.connection;

    try {
        const [results] = await conn.query("SELECT * FROM musics");
    if (results.length === 0) {
            return res.status(404).json({ message: "No musics found." });
        }
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching musics:", error);
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};

export async function getMusicById(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid music ID." });
    }

    const conn = await config.connection;

    try {
        const [results] = await conn.query("SELECT * FROM musics WHERE id = ?", [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: "Music not found." });
        }
        res.status(200).json(results[0]);
        return;
    } catch (error) {
        console.error("Error fetching music:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function createMusic(req: Request, res: Response) {
    if(!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }

    const body = req.body as Partial<IMusic>;
    const music = new Music(body as IMusic);

    if (typeof body.name !== 'string' || body.name.trim() === '' || body.musicFileId === undefined || body.musicFileId === null || body.uploaderId === undefined || body.uploaderId === null) {
        return res.status(400).json({ message: "Invalid music data." });
    }
    const conn = await config.connection;

    try  {
        const [results] = await conn.query("INSERT INTO musics (id, name, albumId, musicFileId, uploaderId) VALUES (null, ?, ?, ?, ?)", [music.name, music.albumId, music.musicFileId, music.uploaderId]);
        res.status(201).json({ message: "Music created successfully.", id: results.insertId });
        return;
    } catch (error) {
        console.error("Error creating music:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function deleteMusic(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid music ID." });
    }

    const conn = await config.connection;

    try {
        const [results] = await conn.query("DELETE FROM musics WHERE id = ?", [id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Music not found." });
        }
        res.status(200).json({ message: "Music deleted successfully." });
        return;
    } catch (error) {
        console.error("Error deleting music:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function updateMusic(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid music ID." });
    }

    if(!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }
    
    const body = req.body as Partial<IMusic>;
    const music: any = new Music(body as IMusic);
    const allowedFields = ["name", "albumId", "musicFileId", "uploaderId"];
    const keys = Object.keys(body).filter(key => allowedFields.includes(key));

    if (keys.length === 0) {
        return res.status(400).json({ message: "No valid fields to update." });
    }

    const updateString = keys.map(key => `${key} = ?`).join(", ");
    const values = keys.map(key => (music)[key]);
    values.push(id);

    const conn = await config.connection;
    try {
        const [results] = await conn.query(`UPDATE musics SET ${updateString} WHERE id = ?`, values);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Music not found." });
        }
        res.status(200).json({ message: "Music updated successfully." });
        return;
    } catch (error) {
        console.error("Error updating music:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
}