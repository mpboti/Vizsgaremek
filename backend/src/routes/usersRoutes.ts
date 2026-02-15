import express, { Router } from "express";
import { getAllUsers, getUserById, createUser, deleteUser, updateUser, logIn } from "../controllers/usersController";
import verifyToken from "../middleware/auth";

const router: Router = express.Router();

router.get('/', getAllUsers, verifyToken);
router.get('/:id', getUserById, verifyToken);
router.post('/login', logIn);
router.post('/signup', createUser);
router.delete('/:id', deleteUser, verifyToken);
router.put('/:id', updateUser, verifyToken);

export default router;