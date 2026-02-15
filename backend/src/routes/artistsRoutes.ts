import express, { Router } from "express";
import { createArtist, deleteArtist, getAllArtists, getArtistById, updateArtist } from "../controllers/artistsController";
import verifyToken from "../middleware/auth";

const router: Router = express.Router();

router.get('/', getAllArtists);
router.get('/:id', getArtistById);
router.post('/', createArtist, verifyToken);
router.delete('/:id', deleteArtist, verifyToken);
router.put('/:id', updateArtist, verifyToken);

export default router;