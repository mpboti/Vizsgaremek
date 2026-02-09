import express, {Router} from "express";
import {getAllAlbums, getAlbumById, createAlbum, deleteAlbum, getMusicsByAlbumId, updateAlbum} from "./albumsController";
import { logIn } from "../users/usersController";

const router: Router = express.Router();

router.get('/', getAllAlbums);
router.get('/:id', getAlbumById);
router.get('/:id/musics', getMusicsByAlbumId);
router.post('/', createAlbum, logIn);
router.delete('/:id', deleteAlbum, logIn);
router.put('/:id', updateAlbum, logIn);

export default router;