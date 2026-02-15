import express, { Router } from "express";
import { createArtist, deleteArtist, getAllArtists, getArtistById, updateArtist } from "../controllers/artistsController";
import verifyToken from "../middleware/auth";

const router: Router = express.Router();

router.get('/', getAllArtists);
router.get('/:id', getArtistById);
router.post('/', verifyToken, createArtist);
router.delete('/:id', verifyToken, deleteArtist);
router.put('/:id', verifyToken, updateArtist);

export default router;