import express, { Router } from "express";
import { uploadMusicFile, uploadImageFile, downloadImageFile, downloadMusicFile, getImageFileList, getImageFileById, deleteImageFile, deleteMusicFile } from "../controllers/filesController";
import verifyToken from "../middleware/auth";

const router: Router = express.Router();

router.post('/music', verifyToken, uploadMusicFile);
router.post('/image', uploadImageFile);
router.get('/image', verifyToken, getImageFileList);
router.get('/image/:id', getImageFileById);
router.get('/musicDownload/:id', verifyToken, downloadMusicFile);
router.get('/imageDownload/:id', verifyToken, downloadImageFile);
router.delete('/image/:id', verifyToken, deleteImageFile);
router.delete('/music/:id', verifyToken, deleteMusicFile);

export default router;