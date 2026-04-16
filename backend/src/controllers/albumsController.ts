import { Request, Response } from "express";
import config from "../config/config";
import Album, { IAlbum } from "../classes/albums";

export async function getAllAlbums(_req: Request, res: Response) {
    const conn = await config.connection;
    res.setHeader('Cache-Control', 'no-store');
    try {
        const [results] = await conn.query("SELECT * FROM albums");
        if (results.length === 0) {
            return res.status(300).json({ message: "No albums found." });
        }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};

export async function getAlbumById(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid album ID." });
    }

    const conn = await config.connection;

    try {
        const [results] = await conn.query("SELECT * FROM albums WHERE id = ?", [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: "Album not found." });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};

export async function createAlbum(req: Request, res: Response) {
    if(!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }

    const album = new Album(req.body as unknown as IAlbum);
    if (typeof album.name !== 'string' || album.name.trim() === '') {
        return res.status(400).json({ message: "Invalid album data." });
    }
    const conn = await config.connection;
    try  {
        const [results] = await conn.query("INSERT INTO albums (id, name, releaseDate, externalLink, artistId) VALUES (null, ?, ?, ?, ?)", [album.name, album.releaseDate, album.externalLink, album.artistId]);
        res.status(201).json({ message: "Album created successfully.", id: results.insertId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};

export async function deleteAlbum(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid album ID." });
    }

    const conn = await config.connection;
    try {
        const [results] = await conn.query("DELETE FROM albums WHERE id = ?", [id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Album not found." });
        }
        res.status(200).json({ message: "Album deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};

export async function updateAlbum(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid album ID." });
    }

    if(!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }

    const album: any = new Album(req.body as unknown as IAlbum);
    const allowedFields = ["name", "imageFileId", "externalLink", "releaseDate"];
    const keys = Object.keys(album).filter(key => allowedFields.includes(key));

    const conn = await config.connection;

    try {
        let updateString = keys.map(key => {if(album[key]!=null && album[key]!="") return `${key} = ?`; else return null;}).filter(value => value !== null).join(", ");
        const values = keys.map(key => {if(album[key]!=null && album[key]!="") return album[key]; else return null;}).filter(value => value !== null);
        if(req.body.imageFileId){
            updateString = updateString+", externalLink=?"
            values.push(null);
        }else if(req.body.externalLink){
            updateString = updateString+", imageFileId=?"
            values.push(null);
        }
        values.push(id);
        const [results] = await conn.query(`UPDATE albums SET ${updateString} WHERE id = ?`, values);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Album not found." });
        }
        res.status(200).json({ message: "Album updated successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};

export async function getAlbumsByArtistId(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid artist ID." });
    }

    const conn = await config.connection;
    try {
        const [results] = await conn.query("SELECT * FROM albums WHERE artistId = ?", [id]);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    } 
    return;
};