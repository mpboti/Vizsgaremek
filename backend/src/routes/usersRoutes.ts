import express, { Router } from "express";
import { getAllUsers, getUserById, createUser, deleteUser, updateUser, logIn } from "../controllers/usersController";
import verifyToken from "../middleware/auth";

const router: Router = express.Router();

router.get('/', verifyToken, getAllUsers);
router.get('/getuser/:id', verifyToken, getUserById);
router.post('/login', logIn);
router.post('/signup', createUser);
router.delete('/:id', verifyToken, deleteUser);
router.put('/:id', verifyToken, updateUser);


export default router;