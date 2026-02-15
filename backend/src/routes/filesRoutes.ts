import express, { Router } from "express";
import { uploadMusicFile, uploadImageFile, downloadImageFile, downloadMusicFile } from "../controllers/filesController";
import verifyToken from "../middleware/auth";

const router: Router = express.Router();

router.post('/music', uploadMusicFile, verifyToken);
router.post('/image', uploadImageFile, verifyToken);
router.get('/music/:filename', downloadMusicFile, verifyToken);
router.get('/image/:filename', downloadImageFile, verifyToken);

export default router;