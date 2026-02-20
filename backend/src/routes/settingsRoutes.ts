import express, { Router } from 'express';
import verifyToken from '../middleware/auth';
import { getAllSettings, getSettingsById, updateSettingsById } from '../controllers/settingsController';

const router: Router = express.Router()

router.get('/', verifyToken, getAllSettings);
router.get('/:id', verifyToken, getSettingsById);
router.put('/:id', verifyToken, updateSettingsById);

export default router;