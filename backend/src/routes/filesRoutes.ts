import express, { Router } from "express";
import { uploadMusicFile, uploadImageFile, downloadImageFile, downloadMusicFile } from "../controllers/filesController";
import verifyToken from "../middleware/auth";

const router: Router = express.Router();

router.post('/music', verifyToken, uploadMusicFile);
router.post('/image', uploadImageFile);
router.get('/music/:filename', verifyToken, downloadMusicFile);
router.get('/image/:filename', verifyToken, downloadImageFile);

export default router;