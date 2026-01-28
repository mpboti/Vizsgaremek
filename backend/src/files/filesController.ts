import config from "../config/config";
import { Request, Response } from "express";
import fs from "fs";
import { uploadMusicMiddleware, uploadImageMiddleware } from "../middleware/upload";

export async function getMusicFileList (_req: Request, res: Response) {
    const musicDir = config.baseDir + '/uploads/musics/';
    fs.readdir(musicDir, function (err, files) {
        if (err) {
            console.error("Error reading music directory:", err);
            return res.status(500).json({ message: "Internal server error." });
        }
        const musicFiles: any = [];
        files.forEach(function (file) {
            musicFiles.push({ filename: file });
        });
        res.status(200).json(musicFiles);
        return;
    });
}

export async function getImageFileList (_req: Request, res: Response) {
    const imageDir = config.baseDir + '/uploads/images/';
    fs.readdir(imageDir, function (err, files) {
        if (err) {
            console.error("Error reading image directory:", err);
            return res.status(500).json({ message: "Internal server error." });
        }
        const imageFiles: any = [];
        files.forEach(function (file) {
            imageFiles.push({ filename: file });
        });
        res.status(200).json(imageFiles);
        return;
    });
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
    res.download(filePath + fileName, fileName, (err) => {
        if (err) {
            console.error("Error downloading music file:", err);
            res.status(500).json({ message: "Internal server error." });
        } 
    });
    return;
}

export async function downloadImageFile(req: Request, res: Response) {
    const fileName = req.params.id as string;
    const filePath = config.baseDir + '/uploads/images/';
    res.download(filePath + fileName, fileName, (err) => {
        if (err) {
            console.error("Error downloading image file:", err);
            res.status(500).json({ message: "Internal server error." });
        } 
    });
    return;
}