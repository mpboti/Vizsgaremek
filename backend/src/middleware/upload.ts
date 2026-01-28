import multer from "multer";
import util from "util";
import confing from "../config/config";

const musicStorage = multer.diskStorage({
    destination: function (_req: any, _res: any, cb: any){
        cb(null, confing.baseDir + '/uploads/musics/');
    }
});

const imageStorage = multer.diskStorage({
    destination: function (_req: any, _res: any, cb: any){
        cb(null, confing.baseDir + '/uploads/images/');
    }
});

const uploadMusic = multer({ storage: musicStorage }).single('file');
const uploadImage = multer({ storage: imageStorage }).single('file');

export const uploadMusicMiddleware = util.promisify(uploadMusic);
export const uploadImageMiddleware = util.promisify(uploadImage);