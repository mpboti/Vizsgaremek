import { Request, Response } from "express";
import config from "../config/config";

export async function searchMusicsByName(req: Request, res: Response) {
    const conn = await config.connection;
    try {
        const [resultsList] = await conn.query("SELECT * FROM musics WHERE name LIKE ?", [`%${req.query.name}%`]);
        if (resultsList.length === 0) {
            res.status(404).json({ message: "No musics found." });
        }
        let ertekek = [];
        for(const i of resultsList){
            let ertek = {};
            ertek={id: i.id, name: i.name, mufaj: i.mufaj, uploaderId: i.uploaderId, musicFileId: i.musicFileId}
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
}

export async function searchPlaylistsByName(req: Request, res: Response) {
    const conn = await config.connection;
    try {
        const [results] = await conn.query("SELECT * FROM playlists WHERE name LIKE ?", [`%${req.query.name}%`]);
        res.setHeader('Cache-Control', 'no-store');
        if (results.length == 0){
            res.status(300).json({ message: "No playlists found for this user." });
            return;
        }
        const atributes = new Array();
        for (const result of results){
            const [username] = await conn.query("SELECT users.username FROM users WHERE users.id = ?", [result.ownerId]);
            if (username.length == 0) {
                res.status(300).json({ message: "User not found." });
                return;
            }
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
}

export async function searchMusicsByArtist(req: Request, res: Response){
    const conn = await config.connection;
    try {
        const [resultsList] = await conn.query("SELECT musics.id, musics.name, musics.mufaj, musics.uploaderId, musics.artistId, musics.albumId, musics.musicFileId FROM musics INNER JOIN artists ON artists.id = musics.artistId WHERE artists.name LIKE ?", [`%${req.query.name}%`]);
        if (resultsList.length === 0) {
            res.status(404).json({ message: "No musics found." });
        }
        let ertekek = [];
        for(const i of resultsList){
            let ertek = {};
            ertek={id: i.id, name: i.name, mufaj: i.mufaj, uploaderId: i.uploaderId, musicFileId: i.musicFileId}
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
}

export async function searchMusicsByAlbum(req: Request, res: Response){
    const conn = await config.connection;
    try {
        const [resultsList] = await conn.query("SELECT musics.id, musics.name, musics.mufaj, musics.uploaderId, musics.artistId, musics.albumId, musics.musicFileId FROM musics INNER JOIN albums ON albums.id = musics.albumId WHERE albums.name LIKE ?", [`%${req.query.name}%`]);
        if (resultsList.length === 0) {
            res.status(404).json({ message: "No musics found." });
        }
        let ertekek = [];
        for(const i of resultsList){
            let ertek = {};
            ertek={id: i.id, name: i.name, mufaj: i.mufaj, uploaderId: i.uploaderId, musicFileId: i.musicFileId}
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
}

export async function searchMusicsByUsername(req: Request, res: Response){
    const conn = await config.connection;
    try {
        const [resultsList] = await conn.query("SELECT musics.id, musics.name, musics.mufaj, musics.uploaderId, musics.artistId, musics.albumId, musics.musicFileId FROM musics INNER JOIN users ON users.id = musics.uploaderId WHERE users.username LIKE ?", [`%${req.query.name}%`]);
        if (resultsList.length === 0) {
            res.status(404).json({ message: "No musics found." });
        }
        let ertekek = [];
        for(const i of resultsList){
            let ertek = {};
            ertek={id: i.id, name: i.name, mufaj: i.mufaj, uploaderId: i.uploaderId, musicFileId: i.musicFileId}
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
}

export async function searchPlaylistsByUsername(req: Request, res: Response){
    const conn = await config.connection;
    try {
        const [results] = await conn.query("SELECT playlists.id, playlists.name, playlists.ownerId, playlists.playlistPicId, playlists.playlistPicUrl, users.username FROM playlists INNER JOIN users ON users.id = playlists.ownerId WHERE users.username LIKE ?", [`%${req.query.name}%`]);
        res.setHeader('Cache-Control', 'no-store');
        if (results.length == 0){
            res.status(300).json({ message: "No playlists found for this user." });
            return;
        }
        const atributes = new Array();
        for (const result of results){
            if(result.playlistPicId!=null){
                const [results2] = await conn.query("SELECT * FROM image_files WHERE id = ?", [result.playlistPicId]);
                atributes.push({ ...result, url: (results2[0].filePath).slice(config.baseDir.length)});
            }else if(result.playlistPicUrl!=null){
                atributes.push({ ...result, url: result.playlistPicUrl});
            }else{   
                atributes.push({ ...result, url: null});
            }
        }
        res.status(200).json(atributes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
    return;
}

export async function searchReportsByMessage(req: Request, res: Response){
    const conn = await config.connection;
    try {
        
        const [results] = await conn.query("SELECT * FROM reports WHERE message LIKE ?", [`%${req.query.message}%`]);
        res.setHeader('Cache-Control', 'no-store');
        if (results.length == 0){
            res.status(300).json({ message: "No reports found." });
            return;
        }
        
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
    return;
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

export async function searchMusicByNameInPlaylist(req: Request, res: Response) {
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

export async function searchMusicByNameInAlbum(req: Request, res: Response) {
    const conn = await config.connection;

    try {
        const [results] = await conn.query("SELECT * FROM musics WHERE albumId = ? AND name LIKE ?", [req.query.albumId, `%${req.query.name}%`]);
        if (results.length === 0) {
            res.status(404).json({ message: "No musics found." });
        }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};

export async function searchMusicByNameByArtist(req: Request, res: Response) {
    const conn = await config.connection;

    try {
        const [results] = await conn.query("SELECT * FROM musics WHERE artistId = ? AND name LIKE ?", [req.query.artistId, `%${req.query.name}%`]);
        if (results.length === 0) {
            res.status(404).json({ message: "No musics found." });
        }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};

export async function searchAlbumsByNameByArtist(req: Request, res: Response) {
    const conn = await config.connection;

    try {
        const [results] = await conn.query("SELECT * FROM albums WHERE artistId = ? AND name LIKE ?", [req.query.artistId, `%${req.query.name}%`]);
        if (results.length === 0) {
            res.status(404).json({ message: "No albums found." });
        }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};