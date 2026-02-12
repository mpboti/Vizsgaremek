import config from "../config/config";
import fs from "fs";

export interface IImageFile {
    id: string;
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
    id: string;
    name: string;
    path: string;
    size: number;
    mimeType: string;
    userId: number;
    constructor(file: IMulterFile, userId: number) {
        this.id = file.filename;
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
                'INSERT INTO image_files (id, name, path, size, mime_type, user_id) VALUES (?, ?, ?, ?, ?, ?)',
                [this.id, this.name, this.path, this.size, this.mimeType, this.userId]
            );
            if (results.affectedRows === 0) {
                throw new Error("Failed to save image file to database.");
            }
            [results] = await conn.query(
                'UPDATE users SET imageId = ? WHERE id = ?',
                [results.insertId, this.userId]
            );
            if (results.affectedRows === 0) {
                throw new Error("Failed to update user's imageId.");
            }
            await conn.commit();
        } catch (error) {
            this.deleteFileDir();
            await conn.rollback();
            throw error;
        }
    }

    deleteFileDir(){
        try {
            fs.unlinkSync(config.baseDir + config.imageUploadDir + this.id);
        } catch (error) {
            console.log("Error deleting file after DB failure:", error);
        }
    }
}