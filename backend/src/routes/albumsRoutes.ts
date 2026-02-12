import express, {Router} from "express";
import {getAllAlbums, getAlbumById, createAlbum, deleteAlbum, getMusicsByAlbumId, updateAlbum} from "../controllers/albumsController";
import { logIn } from "../controllers/usersController";

const router: Router = express.Router();

router.get('/', getAllAlbums);
router.get('/:id', getAlbumById);
router.get('/:id/musics', getMusicsByAlbumId);
router.post('/', createAlbum, logIn);
router.delete('/:id', deleteAlbum, logIn);
router.put('/:id', updateAlbum, logIn);

export default router;