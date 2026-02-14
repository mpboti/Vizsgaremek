import express, {Router} from "express";
import {getAllMusics, getMusicById, createMusic, deleteMusic, updateMusic, getMusicsByAlbumId from "../controllers/musicsController";
import { logIn } from "../controllers/usersController";

const router: Router = express.Router();

router.get('/', getAllMusics);
router.get('/:id', getMusicById);
router.get('/album/:id', getMusicsByAlbumId);
router.post('/', createMusic, logIn);
router.delete('/:id', deleteMusic, logIn);
router.put('/:id', updateMusic, logIn);

export default router;