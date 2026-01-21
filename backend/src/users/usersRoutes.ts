import express, { Router } from "express";
import { getAllUsers, getUserById, createUser, deleteUser, updateUser } from "./usersController";

const router: Router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

export default router;