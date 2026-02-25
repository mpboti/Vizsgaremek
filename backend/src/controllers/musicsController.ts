import { Request, Response } from "express";
import config from "../config/config";
import Music, {IMusic} from "../classes/musics";
import { safeUnlink } from "../utils/fileUtils";

export async function getAllMusics(_req: Request, res: Response) {
    const conn = await config.connection;
    res.setHeader('Cache-Control', 'no-store');
    try {
        const [results] = await conn.query("SELECT * FROM musics");
    if (results.length === 0) {
            return res.status(300).json({ message: "No musics found." });
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
        let ertek = {};
        const [results] = await conn.query("SELECT * FROM musics WHERE id = ?", [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: "Music not found." });
        }
        ertek={id: results[0].id, name: results[0].name, mufaj: results[0].mufaj}
        if(results[0].artistId!=null){
            const [results2] = await conn.query("SELECT name FROM artists WHERE id = ?", results[0].artistId);
            if(results2.length == 0){
                return res.status(404).json({ message: "Artist not found." });
            }
            ertek = {...ertek, artistName: results2[0].name};
        }
        if(results[0].albumId!=null){
            const [results2] = await conn.query("SELECT name, releaseDate, imageFilePath, imageFileId FROM albums WHERE id = ?", results[0].albumId);
            if(results2.length == 0){
                return res.status(404).json({ message: "Album not found." });
            }
            if(results2[0].imageFileId != null){
                const [results3] = await conn.query("SELECT * FROM albums WHERE id = ?", results2[0].imageFileId);
                if(results3[0] == 0){
                    return res.status(404).json({ message: "Album pic not found." });
                }
                ertek = {...ertek, imageUrl: (results3[0].filePath).slice(config.baseDir.length)};
            }else if(results2[0].imageFilePath != null){
                ertek = {...ertek, imageUrl: results2[0].imageFilePath};
            }else{
                ertek = {...ertek, imageUrl: null};
            }
            ertek = {...ertek, albumName: results2[0].name};
            ertek = {...ertek, releaseDate: results2[0].releaseDate};
        }
        const [results2] = await conn.query("SELECT fileName, mimeType, filePath FROM music_files WHERE id = ?", results[0].musicFileId);
        if(results2.length == 0){
            return res.status(404).json({ message: "Music file not found." });
        }
        ertek = {...ertek, musicUrl: (results2[0].filePath).slice(config.baseDir.length)}
        res.status(200).json(ertek);
        return;
    } catch (error) {
        console.error("Error fetching music:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function getMusicbyPlaylistId(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid music ID." });
    }
    
    const conn = await config.connection;

    try {
        const [resultsList] = await conn.query("SELECT position, musicId FROM playlist_musics WHERE playlistId = ?", [id]);
        let ertekek = [];
        for(const i of resultsList){
            let ertek : any = {position: i.position};
            const [results] = await conn.query("SELECT * FROM musics WHERE id = ?", [i.musicId]);
            if (results.length === 0) {
                return res.status(404).json({ message: "Music not found." });
            }
            ertek={id: results[0].id, name: results[0].name, mufaj: results[0].mufaj, uploaderId: results[0].uploaderId}
            if(results[0].artistId!=null){
                const [results2] = await conn.query("SELECT name FROM artists WHERE id = ?", results[0].artistId);
                if(results2.length == 0){
                    return res.status(404).json({ message: "Artist not found." });
                }
                ertek = {...ertek, artistName: results2[0].name};
            }
            if(results[0].albumId!=null){
                const [results2] = await conn.query("SELECT name, releaseDate, imageFilePath, imageFileId FROM albums WHERE id = ?", results[0].albumId);
                if(results2.length == 0){
                    return res.status(404).json({ message: "Album not found." });
                }
                if(results2[0].imageFileId != null){
                    const [results3] = await conn.query("SELECT * FROM albums WHERE id = ?", results2[0].imageFileId);
                    if(results3[0] == 0){
                        return res.status(404).json({ message: "Album pic not found." });
                    }
                    ertek = {...ertek, imageUrl: (results3[0].filePath).slice(config.baseDir.length)};
                }else if(results2[0].imageFilePath != null){
                    ertek = {...ertek, imageUrl: results2[0].imageFilePath};
                }else{
                    ertek = {...ertek, imageUrl: null};
                }
                ertek = {...ertek, albumName: results2[0].name};
                ertek = {...ertek, releaseDate: results2[0].releaseDate};
            }
            const [results2] = await conn.query("SELECT fileName, mimeType, filePath FROM music_files WHERE id = ?", results[0].musicFileId);
            if(results2.length == 0){
                return res.status(404).json({ message: "Music file not found." });
            }
            ertek = {...ertek, musicUrl: (results2[0].filePath).slice(config.baseDir.length)}
            ertekek.push(ertek);
        }
        if (ertekek.length === 0){
            res.status(404).json({ message: "No musics found." })
        }
        ertekek = ertekek.sort((a, b) => a.position - b.position)
        res.status(200).json(ertekek);
        return;
    } catch (error) {
        console.error("Error fetching music:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function getMusicByUserId(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid music ID." });
    }
    
    const conn = await config.connection;

    try {
        const [resultsList] = await conn.query("SELECT * FROM musics WHERE uploaderId = ?", [id]);
        if (resultsList.length === 0) {
            return res.status(404).json({ message: "Music not found." });
        }
        let ertekek = [];
        for(const i of resultsList){
            let ertek = {};
            
            ertek={id: i.id, name: i.name, mufaj: i.mufaj, uploaderId: i.uploaderId}
            if(i.artistId!=null){
                const [results2] = await conn.query("SELECT name FROM artists WHERE id = ?", i.artistId);
                if(results2.length == 0){
                    return res.status(404).json({ message: "Artist not found." });
                }
                ertek = {...ertek, artistName: results2[0].name};
            }
            if(i.albumId!=null){
                const [results2] = await conn.query("SELECT name, releaseDate, imageFilePath, imageFileId FROM albums WHERE id = ?", i.albumId);
                if(results2.length == 0){
                    return res.status(404).json({ message: "Album not found." });
                }
                if(results2[0].imageFileId != null){
                    const [results3] = await conn.query("SELECT * FROM albums WHERE id = ?", results2[0].imageFileId);
                    if(results3[0] == 0){
                        return res.status(404).json({ message: "Album pic not found." });
                    }
                    ertek = {...ertek, imageUrl: (results3[0].filePath).slice(config.baseDir.length)};
                }else if(results2[0].imageFilePath != null){
                    ertek = {...ertek, imageUrl: results2[0].imageFilePath};
                }else{
                    ertek = {...ertek, imageUrl: null};
                }
                ertek = {...ertek, albumName: results2[0].name};
                ertek = {...ertek, releaseDate: results2[0].releaseDate};
            }
            const [results2] = await conn.query("SELECT fileName, mimeType, filePath FROM music_files WHERE id = ?", i.musicFileId);
            if(results2.length == 0){
                return res.status(404).json({ message: "Music file not found." });
            }
            ertek = {...ertek, musicUrl: (results2[0].filePath).slice(config.baseDir.length)}
            ertekek.push(ertek);
        }
        if (ertekek.length === 0){
            res.status(404).json({ message: "No musics found." })
        }
        res.status(200).json(ertekek);
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
        const [results] = await conn.query("INSERT INTO musics (id, name, mufaj, albumId, artistId, musicFileId, uploaderId) VALUES (null, ?, ?, ?, ?, ?, ?)", [music.name, music.mufaj, music.albumId, music.artistId, music.musicFileId, music.uploaderId]);
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
        await conn.beginTransaction();

        const [musicRows] = await conn.query("SELECT musicFileId FROM musics WHERE id = ?", [id]);
        if (!musicRows || musicRows.length === 0) {
            await conn.rollback();
            return res.status(404).json({ message: "Music not found." });
        }
        const musicFileId = musicRows[0].musicFileId as number;

        // delete the music row
        const [delMusicRes] = await conn.query("DELETE FROM musics WHERE id = ?", [id]);
        if (delMusicRes.affectedRows === 0) {
            await conn.rollback();
            return res.status(404).json({ message: "Music not found." });
        }

        let filePath: string | null = null;
        if (musicFileId) {
            // if no other musics reference this file, remove the file record and capture filePath
            const [countRows] = await conn.query("SELECT COUNT(*) as cnt FROM musics WHERE musicFileId = ?", [musicFileId]);
            const cnt = (countRows && countRows[0] && (countRows[0] as any).cnt) || 0;
            if (cnt === 0) {
                const [fileRows] = await conn.query("SELECT filePath FROM music_files WHERE id = ?", [musicFileId]);
                if (fileRows && fileRows.length > 0) filePath = fileRows[0].filePath as string;
                await conn.query("DELETE FROM music_files WHERE id = ?", [musicFileId]);
            }
        }

        await conn.commit();

        // unlink after commit
        if (filePath) {
            safeUnlink(filePath).catch(err => console.error('Failed to unlink music file:', filePath, err));
        }

        res.status(200).json({ message: "Music deleted successfully." });
        return;
    } catch (error) {
        await conn.rollback();
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
    const allowedFields = ["name", "albumId", "artistId", "musicFileId", "uploaderId", "mufaj"];
    const keys = Object.keys(body).filter(key => allowedFields.includes(key));

    if (keys.length === 0) {
        return res.status(400).json({ message: "No valid fields to update." });
    }

    const updateString = keys.map(key => {if(music[key]!=null && music[key]!="") return `${key} = ?`; else return null;}).filter(value => value !== null).join(", ");
    const values = keys.map(key => {if(music[key]!=null && music[key]!="") return music[key]; else return null;}).filter(value => value !== null);
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

export async function getMusicsByAlbumId(req: Request, res: Response) {
    const albumId: number = parseInt(req.params.id as string);
    if (isNaN(albumId)) {
        return res.status(400).json({ message: "Invalid album ID." });
    }

    const conn = await config.connection;
    try {
        const [results] = await conn.query("SELECT * FROM musics WHERE albumId = ?", [albumId]);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching musics by album ID:", error);
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};