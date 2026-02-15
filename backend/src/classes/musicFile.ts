import config from "../config/config";
import fs from "fs";

export interface IMusicFile {
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

export class MusicFile implements IMusicFile {
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

    async saveToDatabase(): Promise<number> {
        const conn = await config.connection;
        try {
            await conn.beginTransaction();
            let [results]: any = await conn.query(
                'INSERT INTO music_files (id, fileName, filePath, fileSize, mimeType, userId) VALUES (?, ?, ?, ?, ?, ?)',
                [this.id, this.name, this.path, this.size, this.mimeType, this.userId]
            );
            if (results.affectedRows === 0) {
                throw new Error("Failed to save music file to database.");
            }
            await conn.commit();
            return results.insertId;
        } catch (error) {
            this.deleteFileDir();
            await conn.rollback();
            throw error;
        }
    }

    deleteFileDir(){
        try {
            fs.unlinkSync(config.baseDir + config.musicUploadDir + this.id);
        } catch (error) {
            console.log("Error deleting file after DB failure:", error);
        }
    }
}
