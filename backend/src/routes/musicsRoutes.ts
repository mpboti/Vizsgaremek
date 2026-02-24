import express, {Router} from "express";
import {getAllMusics, getMusicById, getMusicbyPlaylistId, createMusic, deleteMusic, updateMusic, getMusicByUserId, getMusicsByAlbumId } from "../controllers/musicsController";
import verifyToken from "../middleware/auth";

const router: Router = express.Router();

router.get('/', getAllMusics);
router.get('/:id', getMusicById);
router.get('/byplaylistid/:id', getMusicbyPlaylistId);
router.get('/byuserid/:id', getMusicByUserId);
router.get('/album/:id', getMusicsByAlbumId);
router.post('/', verifyToken, createMusic);
router.delete('/:id', verifyToken, deleteMusic);
router.put('/:id', verifyToken, updateMusic);

export default router;
