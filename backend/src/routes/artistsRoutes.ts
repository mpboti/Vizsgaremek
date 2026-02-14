import express, { Router } from "express";
import { createArtist, deleteArtist, getAllArtists, getArtistById, updateArtist } from "../controllers/artistsController";
import { logIn } from "../controllers/usersController";

const router: Router = express.Router();

router.get('/', getAllArtists);
router.get('/:id', getArtistById);
router.post('/', createArtist, logIn);
router.delete('/:id', deleteArtist, logIn);
router.put('/:id', updateArtist, logIn);

export default router;