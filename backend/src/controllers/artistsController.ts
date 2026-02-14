import { Request, Response } from "express";
import config from "../config/config";
import Artist, { IArtist } from "../classes/artists";

export async function getAllArtists(_req: Request, res: Response) {
    const conn = await config.connection;

    try{
        const [results] = await conn.query("SELECT * FROM artists");
        if (results.length === 0) {
            return res.status(404).json({ message: "No artists found." });
        }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};

export async function getArtistById(req: Request, res: Response) { 
    const id: number = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid artist ID." });
    }
    
    const conn = await config.connection;

    try {
        const [results] = await conn.query("SELECT * FROM artists WHERE id = ?", [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: "Artist not found." });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};

export async function createArtist(req: Request, res: Response) {
    if(!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }
    const body = req.body as Partial<IArtist>;
    const artist = new Artist(body as IArtist);
    if (typeof body.name !== 'string' || body.name.trim() === '') {
        return res.status(400).json({ message: "Invalid artist data." });
    }

    const conn = await config.connection;
    try  {
        const [results] = await conn.query("INSERT INTO artists (id, name, imageFileId) VALUES (null, ?, ?)", [artist.name, artist.imageFileId]);
        res.status(201).json({ message: "Artist created successfully.", id: results.insertId });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};

export async function deleteArtist(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid artist ID." });
    }

    const conn = await config.connection;
    try {
        const [results] = await conn.query("DELETE FROM artists WHERE id = ?", [id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Artist not found." });
        }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};

export async function updateArtist(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid artist ID." });
    }

    if (!req.body) {
        return res.status(400).json({ message: "Invalid artist data." });
    }

    const artist: any = new Artist(req.body as unknown as IArtist);
    const allowedFields = ["name", "imageFileId"];
    const keys = Object.keys(artist).filter(key => allowedFields.includes(key));

    if (keys.length === 0) {
        return res.status(400).json({ message: "No valid fields to update." });
    }

    const updateString = keys.map(key => `${key} = ?`).join(", ");
    const values = keys.map(key => (artist)[key]);
    values.push(id);

    const conn = await config.connection;
    try {
        const [results] = await conn.query(`UPDATE artists SET ${updateString} WHERE id = ?`, values);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Artist not found." });
        }
        res.status(200).json({ message: "Artist updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};