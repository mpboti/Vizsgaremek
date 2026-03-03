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
        const [username] = await conn.query("SELECT users.username FROM users WHERE users.id = ?", [id]);
        res.setHeader('Cache-Control', 'no-store');
        if (results.length == 0){
            res.status(300).json({ message: "No playlists found for this user." });
            return;
        }
        if (username.length == 0) {
            res.status(300).json({ message: "User not found." });
            return;
        }
        const atributes = new Array();
        for (const result of results){
            if(result.playlistPicId!=null){
                const [results2] = await conn.query("SELECT * FROM image_files WHERE id = ?", [result.playlistPicId]);
                atributes.push({ ...result, url: (results2[0].filePath).slice(config.baseDir.length), ...username[0]});
            }else if(result.playlistPicUrl!=null){
                atributes.push({ ...result, url: result.playlistPicUrl, ...username[0]});
            }else{   
                atributes.push({ ...result, url: null, ...username[0]})
            }
        }
        res.status(200).json(atributes);
    } catch (error) {
        console.log(error);
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
        const [results] = await conn.query("SELECT playlists.id, playlists.name, playlists.ownerId, image_files.fileName, image_files.mimeType, image_files.filePath FROM playlists INNER JOIN image_files ON image_files.id = playlists.playlistPicId WHERE playlists.id = ?", [id]);
        const [musics] = await conn.query("SELECT musicId, position FROM playlist_musics WHERE playlistId = ?", [id]);
        if (results.length === 0) {
            const [results2] = await conn.query("SELECT playlists.id, playlists.name, playlists.ownerId, playlists.playlistPicUrl FROM playlists WHERE id = ?", [id]);
            if (results2.length === 0) {
                res.status(404).json({ message: "Playlist not found." });
                return;
            }
            const [username] = await conn.query("SELECT users.username FROM users WHERE users.id = ?", [results2[0].ownerId]);
            if (username.length === 0) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            if(results2[0].playlistPicUrl!=null){
                res.status(200).json({...results2[0], url: results2[0].playlistPicUrl, musics: musics, ...username[0]});
            }else{   
                res.status(200).json({...results2[0], url: null, musics: musics, ...username[0]});
            }
        }else{
            const [username] = await conn.query("SELECT users.username FROM users WHERE users.id = ?", [results[0].ownerId]);
            if (username.length === 0) {
                res.status(404).json({ message: "User not found." });
                return;
            }            
            res.status(200).json({...results[0], url: (results[0].filePath).slice(config.baseDir.length), musics: musics, ...username[0]});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
    return;
};

export async function getPlaylistsByUserIdAndMusicId(req: Request, res: Response) {
    const userId: number = parseInt(req.body.userId as string);
    const musicId: number = parseInt(req.body.musicId as string);
    if (isNaN(userId) || isNaN(musicId)) {
        return res.status(400).json({ message: "Invalid playlist ID or music ID." });
    }
    const conn = await config.connection;
    try  {
        const [results] = await conn.query("SELECT id, name FROM playlists WHERE ownerId = ?", [userId]);
        if (results.length === 0) {
            res.status(200).json({isThere: false});
            return;
        }
        let ertekek : any = {isThere: true, playlists: []}
        for(const elem of results){
            const [results] = await conn.query("SELECT playlistId FROM playlist_musics WHERE playlistId = ? AND musicId = ?", [elem.id, musicId]);
            if (results.length > 0) {
                ertekek.playlists.push({id: elem.id, name: elem.name})
            }
        }
        res.status(200).json(ertekek);
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
        return;
    }
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
        const [playlists] = await conn.query("SELECT * FROM playlists WHERE ownerId = ?", [playlist.creatorId]);
        playlist.position=playlists.length+1;
        const [results] = await conn.query("INSERT INTO playlists (id, name, ownerId, playlistPicId, playlistPicUrl, position) VALUES (null, ?, ?, ?, ?, ?)",
        [playlist.name, playlist.creatorId, playlist.playlistPicId, playlist.playlistPicUrl, playlist.position]);
        res.status(201).json({ message: "Playlist created successfully.", id: results.insertId });
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function addMusicToPlaylist(req: Request, res: Response) {
    if(!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }
    const playlistId: number = parseInt(req.body.playlistId as string);
    if (isNaN(playlistId)) {
        return res.status(400).json({ message: "Invalid playlist ID or music ID." });
    }
    let position = 1;
    const conn = await config.connection;
    try  {
        const [results]=await conn.query("SELECT position FROM playlist_musics WHERE playlistId=?", [playlistId]);
        if(results.length === 0){
            position = 1;
        }else{
            position = parseInt(results[results.length-1].position)+1;
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }

    const playlistMusic = new PlaylistMusics({...req.body, position: position} as unknown as IPlaylistMusics);
    if (playlistMusic.playlistId === undefined || playlistMusic.musicId === undefined || playlistMusic.position === undefined ||
        playlistMusic.playlistId === null || playlistMusic.musicId === null || playlistMusic.position === null) {
        return res.status(400).json({ message: "Invalid playlist music data." });
    }

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
    const playlistId: number = parseInt(req.body.playlistId as string);
    const musicId: number = parseInt(req.body.musicId as string);
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
    if(!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }
    const data = req.body;
    if (data.userId === undefined || data.userId === null) {
        return res.status(400).json({ message: "Invalid playlist data." });
    }
    const conn = await config.connection;
    try {
        const [playlistResults] = await conn.query("SELECT * FROM playlists WHERE ownerId = ?", [data.userId])
        if(playlistResults.some((elem:any)=> elem.id === id)){
            const [results] = await conn.query("DELETE FROM playlists WHERE id = ?", [id]);
            if (results.affectedRows === 0) {
                res.status(404).json({ message: "Playlist not found." });
                return;
            }
            res.status(200).json({ message: "Playlist deleted successfully." });
        }else
            res.status(402).json({ message: "Not your playlist shoo."})
        return;
    } catch (error) {
        console.log(error)
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
        const [results] = await conn.query("UPDATE playlists SET name = ?, playlistPicId = ?, playlistPicUrl = ? WHERE id = ?", [playlist.name, playlist.playlistPicId, playlist.playlistPicUrl, id]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Playlist not found." });
            return;
        }
        console.log(req.body)
        res.status(200).json({ message: "Playlist updated successfully." });
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function updatePlaylistPosition(req: Request, res: Response){
    if(!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }
    const playlistId: number = parseInt(req.body.playlistId as string)
    if (isNaN(playlistId)) {
        return res.status(400).json({ message: "Invalid playlist id." });
    }
    const musicId: number = parseInt(req.body.musicId as string)
    if (isNaN(musicId)) {
        return res.status(400).json({ message: "Invalid music id." });
    }
    const newPos: number = parseInt(req.body.position as string)
    if (isNaN(musicId)) {
        return res.status(400).json({ message: "Invalid position." });
    }

    const conn = config.connection;
    try {
        const originalPos = conn.query("SELECT position FROM playlist_musics WHERE playlistId = ? AND musicId = ?", [playlistId, musicId])
        if (newPos === originalPos){
            res.status(404).json({ message: "The position is unchanged." })
            return;
        } if (newPos > originalPos){ // moving it backwards
            const [updatees] = conn.query("SELECT * FROM playlist_music WHERE playlistId = ? AND position < ? AND position >= ?", [playlistId, newPos, originalPos]);
            conn.query("BEGIN TRAN");
            for (let i = 0; i < updatees.length; i++){
                const updateeNewPos = updatees[i].position - 1;
                conn.query("UPDATE playlist_music SET position = ? WHERE playlistId = ? AND musicId = ?", [updateeNewPos, updatees[i].playlistId, updatees[i].musicId]);
            }
            conn.query("UPDATE playlist_music SET position = ? WHERE playlistId = ? AND musicId = ?", [newPos, playlistId, musicId]);
            conn.query("COMMIT TRAN");
        } else { //moving it forwards
            const [updatees] = conn.query("SELECT * FROM playlist_music WHERE playlistId = ? AND position > ? AND position <= ?", [playlistId, newPos, originalPos]);
            conn.query("BEGIN TRAN");
            for (let i = 0; i < updatees.length; i++){
                const updateeNewPos = updatees[i].position + 1;
                conn.query("UPDATE playlist_music SET position = ? WHERE playlistId = ? AND musicId = ?", [updateeNewPos, updatees[i].playlistId, updatees[i].musicId]);
            }
            conn.query("UPDATE playlist_music SET position = ? WHERE playlistId = ? AND musicId = ?", [newPos, playlistId, musicId]);
            conn.query("COMMIT TRAN");
        }
        res.status(200).json({ message: "Playlist updated." })
    } catch{
        res.status(500).json({ message: "Internal server error." });
        conn.query("ROLLBACK TRAN");
    }
    return;
}