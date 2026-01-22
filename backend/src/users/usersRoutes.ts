import express, { Router } from "express";
import { getAllUsers, getUserById, createUser, deleteUser, updateUser, logIn } from "./usersController";

const router: Router = express.Router();

router.get('/', getAllUsers, logIn);
router.get('/:id', getUserById ,logIn);
router.post('/', createUser);
router.delete('/:id', deleteUser, logIn);
router.put('/:id', updateUser, logIn);

router.post('/login', logIn);

export default router;