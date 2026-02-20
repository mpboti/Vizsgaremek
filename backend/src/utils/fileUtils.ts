import fs from 'fs/promises';
import path from 'path';
import config from '../config/config';

export async function safeUnlink(filePath: string) {
    if (!filePath) return;
    const uploadsDir = path.resolve(config.baseDir, 'uploads');
    const resolved = path.resolve(filePath);

    if (!resolved.startsWith(uploadsDir)) {
        throw new Error(`Refusing to delete outside uploads directory: ${resolved}`);
    }

    try {
        await fs.unlink(resolved);
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            // file already gone, that's fine
            return;
        }
        throw err;
    }
}
