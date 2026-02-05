import config from "../config/config";
import { Request, Response } from "express";
import { uploadMusicMiddleware, uploadImageMiddleware } from "../middleware/upload";

export async function getMusicFileList (_req: Request, res: Response) {
    const conn = await config.connection;
    const [results] = await conn.query("SELECT * FROM music_files");
    if (results.length === 0) {
        res.status(404).json({ message: "No music files found." });
        return;
    }
    res.status(200).json(results);
}

export async function getImageFileList (_req: Request, res: Response) {
    const conn = await config.connection;
    const [results] = await conn.query("SELECT * FROM profile_pictures");
    if (results.length === 0) {
        res.status(404).json({ message: "No image files found." });
        return;
    };
    res.status(200).json(results);
}

export async function uploadMusicFile(req: Request, res: Response) {
    try {
        await uploadMusicMiddleware(req, res);
        if (req.file === undefined) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        res.status(200).json({ message: "Music file uploaded successfully.", filename: req.file.filename });
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
        if (req.file === undefined) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        res.status(200).json({ message: "Image file uploaded successfully.", filename: req.file.filename });
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
        const [ressults] = await conn.query("SELECT * FROM profile_pictures WHERE id = ?", [fileName]);
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