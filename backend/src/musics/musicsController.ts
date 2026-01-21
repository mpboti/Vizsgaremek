import { Request, Response } from "express";
import config from "../config/config";
import Music, {IMusic} from "./musics";

export async function getAllMusics(_req: Request, res: Response) {
    const conn = await config.connection;

    try {
        const [results] = await conn.query("SELECT * FROM musics");
    if (results.length === 0) {
            res.status(404).json({ message: "No musics found." });
        }
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching musics:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export async function getMusicById(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string);
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
    } catch (error) {
        console.error("Error fetching music:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export async function createMusic(req: Request, res: Response) {
    if(!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }

    const music = new Music(req.body as unknown as IMusic);

    if (music.name === undefined || music.musicFileId === undefined || music.uploaderId === undefined ||
        music.name === null || music.musicFileId === null || music.uploaderId === null ||
        music.name === "" || music.musicFileId <= 0 || music.uploaderId <= 0) {
        return res.status(400).json({ message: "Invalid music data." });
    }
    const conn = await config.connection;

    try  {
        const [results] = await conn.query("INSERT INTO musics (id, name, musicFileId, uploaderId) VALUES (null, ?, ?, ?)", [music.name, music.musicFileId, music.uploaderId]);
        res.status(201).json({ message: "Music created successfully.", id: results.insertId });
    } catch (error) {
        console.error("Error creating music:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export async function deleteMusic(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string);
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
    } catch (error) {
        console.error("Error deleting music:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export async function updateMusic(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid music ID." });
    }

    if(!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }
    
    const music: any = new Music(req.body as unknown as IMusic);
    const allowedFields = ["name", "musicFileId", "uploaderId"];
    const keys = Object.keys(music).filter(key => allowedFields.includes(key));

    if (keys.length === 0) {
        return res.status(400).json({ message: "No valid fields to update." });
    }

    const updateString = keys.map(key => `${key} = ?`).join(", ");
    const values = keys.map(key => (music)[key]);
    values.push(id); // For WHERE clause

    const conn = await config.connection;
    try {
        const [results] = await conn.query(`UPDATE musics SET ${updateString} WHERE id = ?`, values);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Music not found." });
        }
        res.status(200).json({ message: "Music updated successfully." });
    } catch (error) {
        console.error("Error updating music:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}