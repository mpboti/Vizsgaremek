import config from "../config/config";

export interface IMusicFile {
    name: string;
    path: string;
    size: number;
    mimeType: string;
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
    name: string;
    path: string;
    size: number;
    mimeType: string;

    constructor(file: IMulterFile) {
        this.name = file.originalname;
        this.path = file.path;
        this.size = file.size;
        this.mimeType = file.mimetype;
    }

    async saveToDatabase() {
        const conn = await config.connection;
        try {
            await conn.beginTransaction();
            let [results] = await conn.query(
                'INSERT INTO music_files (id, fileName, filePath, fileSize, mimeType) VALUES (null, ?, ?, ?, ?)',
                [this.name, this.path, this.size, this.mimeType]
            );
            if (results.affectedRows === 0) {
                throw new Error("Failed to save music file to database.");
            }
            await conn.commit();
            return results.insertId;
        } catch (error) {
            await conn.rollback();
            throw error;
        }
    }
}
