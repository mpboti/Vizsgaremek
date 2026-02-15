import express, {Router} from "express";
import {getAllMusics, getMusicById, createMusic, deleteMusic, updateMusic, getMusicsByAlbumId } from "../controllers/musicsController";
import verifyToken from "../middleware/auth";

const router: Router = express.Router();

router.get('/', getAllMusics);
router.get('/:id', getMusicById);
router.get('/album/:id', getMusicsByAlbumId);
router.post('/', verifyToken, createMusic);
router.delete('/:id', verifyToken, deleteMusic);
router.put('/:id', verifyToken, updateMusic);

export default router;
