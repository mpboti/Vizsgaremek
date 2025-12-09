import { Request, Response } from "express";
import config from '../config/config'
import Musics, { IMusics } from "./musics";

export async function getAllMusics(_req: Request, res: Response){
    const conn = await config.connection;

    try {
        const [results] = await conn.query('SELECT * FROM musics');
        if (results.length === 0) {
            "There are no musics."
            return;
        }
        res.status(200).send(results)
    } catch (error) {
        console.log(error);
    }
}

export async function getMusicById(req: Request, res: Response){
    const id: number = parseInt(req.params.id)
    if (isNaN(id)) {
        res.status(400).send("Id must be a number.")
    }

    const conn = await config.connection;

    try {
        const [results] = await conn.query('SELECT * FROM musics WHERE id = ?', [id]);
        if (results.length === 0) {
            "Music doesn't exist."
            return;
        }
        res.status(200).send(results)
    } catch (error) {
        console.log(error);
    }
}

export async function insertMusic(req: Request, res: Response){
    if (!req.body) {
        res.status(400).send("No data was given.")
        return;
    }

    const music: Musics = new Musics(req.body as unknown as IMusics)
    if (music.name === null || music.name === undefined || music.name === ""){
        res.status(400).send("Name not given.")
        return
    }
    
    const conn = await config.connection;

    try {
        const [results] = await conn.query('INSERT INTO musics VALUES (null,?,?,?)', [music.name, music.album_id, music.mufaj_id]) as Array<any>;
        res.status(201).send(music)
    } catch (error) {
        console.log(error);
    }
}

export async function deleteMusicById(req: Request, res: Response){
    const id: number = parseInt(req.params.id)
    if (isNaN(id)) {
        res.status(400).send("Id must be a number.")
    }

    const conn = await config.connection;

    try {
        const [results] = await conn.query('DELETE FROM musics WHERE id =?', [id])
        res.status(200)
    } catch(error) {
        console.log(error)
    }
}

export async function putMusicsById(req: Request, res: Response){
    const id: number = parseInt(req.params.id)
    if (isNaN(id)) {
        res.status(400).send("Id must be a number.")
    }
    if (!req.body) {
        res.status(400).send("No data was given.")
        return;
    }
    
    let reqMusics: Musics = new Musics(req.body as unknown as IMusics)
    const allowedFields = ['name', 'album_id', 'mufaj_id']
    const keys = Object.keys(reqMusics).filter(key => allowedFields.includes(key))
    if (keys.length === 0){
        res.status(400).send("No fields to be updated.")
        return
    }
    const updateString = keys.map(key => `${key} = ?`).join(',')
    const values = keys.map(key => reqMusics[key])
    values.push(id)
    const sqlQuery = `UPDATE musics SET ${updateString} WHERE id = ?`
}