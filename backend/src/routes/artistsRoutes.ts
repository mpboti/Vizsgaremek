import express, { Router } from "express";
import { createArtist, deleteArtist, getAllArtists, getArtistById, updateArtist } from "../controllers/artistsController";

const router: Router = express.Router();

router.get('/', getAllArtists);
router.get('/:id', getArtistById);
router.post('/', createArtist);
router.delete('/:id', deleteArtist);
router.put('/:id', updateArtist);

export default router;