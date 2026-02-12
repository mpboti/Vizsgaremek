import express, { Router } from "express";
import { uploadMusicFile, uploadImageFile, downloadImageFile, downloadMusicFile } from "../controllers/filesController";
import { logIn } from "../controllers/usersController";

const router: Router = express.Router();

router.post('/music', uploadMusicFile, logIn);
router.post('/image', uploadImageFile, logIn);
router.get('/music/:filename', downloadMusicFile, logIn);
router.get('/image/:filename', downloadImageFile, logIn);

export default router;