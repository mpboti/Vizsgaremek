import multer from "multer";
import util from "util";
import confing from "../config/config";

const musicStorage = multer.diskStorage({
    destination: function (_req: any, _res: any, cb: any){
        cb(null, confing.baseDir + confing.musicUploadDir);
    }
});

const imageStorage = multer.diskStorage({
    destination: function (_req: any, _res: any, cb: any){
        cb(null, confing.baseDir + confing.imageUploadDir);
    }
});

const uploadMusic = multer({ storage: musicStorage, limits: { fileSize: 100 * 1024 * 1024 } }).single('file');
const uploadImage = multer({ storage: imageStorage, limits: { fileSize: 20 * 1024 * 1024 } }).single('file');

export const uploadMusicMiddleware = util.promisify(uploadMusic);
export const uploadImageMiddleware = util.promisify(uploadImage);