import express, {Router} from "express";
import {getAllAlbums, getAlbumById, createAlbum, deleteAlbum, getAlbumsByArtistId, updateAlbum} from "../controllers/albumsController";
import verifyToken from "../middleware/auth";

const router: Router = express.Router();

router.get('/', getAllAlbums);
router.get('/:id', getAlbumById);
router.get('/:id/albums', getAlbumsByArtistId);
router.post('/', createAlbum, verifyToken);
router.delete('/:id', deleteAlbum, verifyToken);
router.put('/:id', updateAlbum, verifyToken);

export default router;