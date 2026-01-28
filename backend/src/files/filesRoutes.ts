import express, { Router } from "express";
import { uploadMusicFile, uploadImageFile, downloadImageFile, downloadMusicFile, getImageFileList, getMusicFileList } from "./filesController";
import { logIn } from "../users/usersController";

const router: Router = express.Router();

router.get('/musicFiles', getMusicFileList, logIn);
router.get('/imageFiles', getImageFileList, logIn);
router.post('/music', uploadMusicFile, logIn);
router.post('/image', uploadImageFile, logIn);
router.get('/music/:filename', downloadMusicFile, logIn);
router.get('/image/:filename', downloadImageFile, logIn);

export default router;