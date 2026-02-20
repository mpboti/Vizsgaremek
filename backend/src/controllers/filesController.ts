import config from "../config/config";
import { Request, Response } from "express";
import { uploadMusicMiddleware, uploadImageMiddleware } from "../middleware/upload";
import { ImageFile } from "../classes/imageFile";
import { MusicFile } from "../classes/musicFile";
import { safeUnlink } from "../utils/fileUtils";

export async function getMusicFileList (_req: Request, res: Response) {
    const conn = await config.connection;
    const [results] = await conn.query("SELECT * FROM music_files");
    if (results.length === 0) {
        res.status(404).json({ message: "No music files found." });
        return;
    }
    res.status(200).json(results);
}

export async function getMusicFileById (req: Request, res: Response){
    const id = req.params.id;
    const conn = await config.connection
    try {
        const [results] = await conn.query("SELECT * FROM music_files WHERE id = ?", [id])
        if (results.length === 0) {
            res.status(404).json({ message: "No music files found." })
        }
        res.status(200).json(results)
    } catch (error) {
        console.error("Error fetching image file: ", error);
        res.status(500).json({ message: "Internal server error." })
    }
}

export async function getImageFileById (req: Request, res: Response) {
    const id = req.params.id;
    const conn = await config.connection;
    try {
        const [results] = await conn.query("SELECT * FROM image_files WHERE id = ?", [id]);
        if (results.length === 0) {
            res.status(404).json({ message: "No image files found." });
            return;
        }
        res.status(200).json({url: (results[0].filePath).slice(config.baseDir.length)});
    } catch (error) {
        console.error("Error fetching image: ", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export async function getImageFileList (_req: Request, res: Response) {
    const conn = await config.connection;
    const [results] = await conn.query("SELECT * FROM image_files");
    if (results.length === 0) {
        res.status(404).json({ message: "No image files found." });
        return;
    };
    res.status(200).json(results);
}

export async function uploadMusicFile(req: Request, res: Response) {
    try {
        const fileId = await uploadMusicMiddleware(req, res);
        if (req.file === undefined) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        const userId = (req as any).user?.id || req.body?.userId;
        if (userId) {
            try {
                const music = new MusicFile(req.file as any, Number(userId));
                await music.saveToDatabase();
            } catch (err) {
                console.error("Error saving music file to DB:", err);
                return res.status(500).json({ message: "Failed to save music metadata to database." });
            }
        }

        res.status(200).json({ message: "Music file uploaded successfully.", id: fileId  });
        return;
    } catch (error) {
        console.error("Error uploading music file:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
}

export async function uploadImageFile(req: Request, res: Response) {
    
    try {
        await uploadImageMiddleware(req, res);
        let fileId = null;
        if (req.file === undefined) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        const userId = (req as any).user?.id || req.body?.userId;
        if (userId) {
            try {
                const img = new ImageFile(req.file as any, Number(userId));
                fileId = await img.saveToDatabase();
            } catch (err) {
                console.error("Error saving image file to DB:", err);
                return res.status(500).json({ message: "Failed to save image metadata to database." });
            }
        }
        console.log("File ID after DB save:", fileId);
        if (fileId === null) {
            return res.status(500).json({ message: "Failed to save image metadata to database." });
        }
        res.status(200).json({ message: "Image file uploaded successfully.", id: fileId });
        return;
    } catch (error) {
        console.error("Error uploading image file:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
}

export async function downloadMusicFile(req: Request, res: Response) {
    const fileName = req.params.id as string;
    const filePath = config.baseDir + '/uploads/musics/';
    const conn = await config.connection;
    try {
        const [ressults] = await conn.query("SELECT * FROM music_files WHERE id = ?", [fileName]);
        if (ressults.length === 0) {
            res.status(404).json({ message: "Music file not found." });
            return;
        }
        res.download(filePath + fileName, fileName, (err) => {
            if (err) {
                console.error("Error downloading music file:", err);
                res.status(500).json({ message: "Internal server error." });
            }
        });
    } catch (error) {
        console.error("Error downloading music file:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function downloadImageFile(req: Request, res: Response) {
    const fileName = req.params.id as string;
    const filePath = config.baseDir + '/uploads/images/';
    const conn = await config.connection;
    try {
        const [ressults] = await conn.query("SELECT * FROM image_files WHERE id = ?", [fileName]);
        if (ressults.length === 0) {
            res.status(404).json({ message: "Image file not found." });
            return;
        }
        res.download(filePath + fileName, fileName, (err) => {
            if (err) {
                console.error("Error downloading image file:", err);
                res.status(500).json({ message: "Internal server error." });
            }
        });
    } catch (error) {
        console.error("Error downloading image file:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
}

export async function deleteImageFile(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    const conn = await config.connection;
    try {
        await conn.beginTransaction();

        const [rows] = await conn.query('SELECT filePath FROM image_files WHERE id = ?', [id]);
        if (!rows || rows.length === 0) {
            await conn.rollback();
            return res.status(404).json({ message: 'Image not found' });
        }

        const filePath = rows[0].filePath as string;

        const [delRes] = await conn.query('DELETE FROM image_files WHERE id = ?', [id]);
        if (delRes.affectedRows === 0) {
            await conn.rollback();
            return res.status(404).json({ message: 'Image not found' });
        }

        await conn.commit();

        // unlink asynchronously; failures logged but do not affect response
        safeUnlink(filePath).catch(err => console.error('Failed to unlink image file:', filePath, err));

        return res.status(204).send();
    } catch (err) {
        await conn.rollback();
        console.error('Error deleting image file:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteMusicFile(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    const conn = await config.connection;
    try {
        await conn.beginTransaction();

        const [rows] = await conn.query('SELECT filePath FROM music_files WHERE id = ?', [id]);
        if (!rows || rows.length === 0) {
            await conn.rollback();
            return res.status(404).json({ message: 'Music file not found' });
        }
        const filePath = rows[0].filePath as string;

        const [delRes] = await conn.query('DELETE FROM music_files WHERE id = ?', [id]);
        if (delRes.affectedRows === 0) {
            await conn.rollback();
            return res.status(404).json({ message: 'Music file not found' });
        }

        await conn.commit();

        safeUnlink(filePath).catch(err => console.error('Failed to unlink music file:', filePath, err));

        return res.status(204).send();
    } catch (err) {
        await conn.rollback();
        console.error('Error deleting music file:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}