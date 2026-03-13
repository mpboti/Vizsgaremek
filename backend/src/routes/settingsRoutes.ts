import express, { Router } from 'express';
import verifyToken from '../middleware/auth';
import { getAllSettings, getSettingsById, updateSettingsById, removePlaylistId } from '../controllers/settingsController';

const router: Router = express.Router()

router.get('/', verifyToken, getAllSettings);
router.get('/:id', verifyToken, getSettingsById);
router.put('/:id', verifyToken, updateSettingsById);
router.put("/removePlaylist/:id", verifyToken, removePlaylistId);

export default router;