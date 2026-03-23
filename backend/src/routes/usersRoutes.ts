import express, { Router } from "express";
import { getAllUsers, getUserById, createUser, deleteUser, updateUser, logIn, passwordCheck, setReport, deleteReport, getReportByUserId, getReportByMusicId } from "../controllers/usersController";
import verifyToken from "../middleware/auth";

const router: Router = express.Router();

router.get('/', verifyToken, getAllUsers);
router.get('/getuser/:id', verifyToken, getUserById);
router.post('/login', logIn);
router.post('/signup', createUser);
router.delete('/:id', verifyToken, deleteUser);
router.put('/:id', verifyToken, updateUser);
router.post('/passcheck', verifyToken, passwordCheck);
router.post('/report', verifyToken, setReport);
router.delete('/delreport/:id', verifyToken, deleteReport);
router.get('/reportByUserId/:id', getReportByUserId);
router.get('/reportByMusicId/:id', getReportByMusicId);

export default router;