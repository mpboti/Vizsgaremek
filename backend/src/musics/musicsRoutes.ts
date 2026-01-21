import express, {Router} from "express";
import {getAllMusics, getMusicById, createMusic, deleteMusic, updateMusic} from "./musicsController";

const router: Router = express.Router();

router.get('/', getAllMusics);
router.get('/:id', getMusicById);
router.post('/', createMusic);
router.delete('/:id', deleteMusic);
router.put('/:id', updateMusic);

export default router;