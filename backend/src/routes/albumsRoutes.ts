import express, {Router} from "express";
import {getAllAlbums, getAlbumById, createAlbum, deleteAlbum, getAlbumsByArtistId, updateAlbum} from "../controllers/albumsController";
import verifyToken from "../middleware/auth";

const router: Router = express.Router();

router.get('/', getAllAlbums);
router.get('/:id', getAlbumById);
router.get('/:id/albums', getAlbumsByArtistId);
router.post('/', verifyToken, createAlbum);
router.delete('/:id', verifyToken, deleteAlbum);
router.put('/:id', verifyToken, updateAlbum);

export default router;