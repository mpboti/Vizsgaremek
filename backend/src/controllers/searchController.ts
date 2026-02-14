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

export async function searchAlbumsByName(req: Request, res: Response) {
    const conn = await config.connection;

    try {
        const [results] = await conn.query("SELECT * FROM albums WHERE name LIKE ?", [`%${req.query.name}%`]);
        if (results.length === 0) {
            res.status(404).json({ message: "No albums found." });
        }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};

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

export async function searchArtistsByName(req: Request, res: Response) {
    const conn = await config.connection;
    try {
        const [results] = await conn.query("SELECT * FROM artists WHERE name LIKE ?", [`%${req.query.name}%`]);
        if (results.length === 0) {
            res.status(404).json({ message: "No artists found." });
        }
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
    return;
};