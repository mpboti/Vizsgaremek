import express, {Router} from "express";
import {getAllMusics, getMusicById, createMusic, deleteMusic, updateMusic} from "./musicsController";
import { logIn } from "../users/usersController";

const router: Router = express.Router();

router.get('/', getAllMusics);
router.get('/:id', getMusicById);
router.post('/', createMusic, logIn);
router.delete('/:id', deleteMusic, logIn);
router.put('/:id', updateMusic, logIn);

export default router;