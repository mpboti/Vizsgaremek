import config from "../config/config";
import fs from "fs";

export interface IImageFile {
    name: string;
    path: string;
    size: number;
    mimeType: string;
    userId: number;
}

export interface IMulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
}

export class ImageFile implements IImageFile {
    name: string;
    path: string;
    size: number;
    mimeType: string;
    userId: number;
    constructor(file: IMulterFile, userId: number) {
        this.name = file.originalname;
        this.path = file.path;
        this.size = file.size;
        this.mimeType = file.mimetype;
        this.userId = userId;
    }
    async saveToDatabase() {
        const conn = await config.connection;
        try {
            await conn.beginTransaction();
            let [results] = await conn.query(
                'INSERT INTO image_files (id, flieName, filePath, fileSize, mimeType, userId) VALUES (null, ?, ?, ?, ?, ?)',
                [this.name, this.path, this.size, this.mimeType, this.userId]
            );
            if (results.affectedRows === 0) {
                throw new Error("Failed to save image file to database.");
            }
            await conn.commit();
            return results.id;
        } catch (error) {
            await conn.rollback();
            throw error;
        }
    }
}