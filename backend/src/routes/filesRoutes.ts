import express, { Router } from "express";
import { uploadMusicFile, uploadImageFile, downloadImageFile, downloadMusicFile, getImageFileList, getImageFileById } from "../controllers/filesController";
import verifyToken from "../middleware/auth";

const router: Router = express.Router();

router.post('/music', verifyToken, uploadMusicFile);
router.post('/image', uploadImageFile);
router.get('/image', verifyToken, getImageFileList);
router.get('/image/:id', verifyToken, getImageFileById);
router.get('/music/:filename', verifyToken, downloadMusicFile);
router.get('/image/:filename', verifyToken, downloadImageFile);

export default router;