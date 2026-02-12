import express, { Router } from "express";
import { getAllUsers, getUserById, createUser, deleteUser, updateUser, logIn } from "./usersController";

const router: Router = express.Router();

router.get('/', getAllUsers, logIn);
router.get('/:id', getUserById, logIn);
router.post('/login', logIn);
router.post('/signup', createUser);
router.delete('/:id', deleteUser, logIn);
router.put('/:id', updateUser, logIn);

export default router;