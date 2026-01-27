import express, { Router } from "express"
import { searchMusicsByName, searchUsersByUsername } from "./searchController";

const router: Router = express.Router();

router.get('/musicsByName', searchMusicsByName);
router.get('/usersByUsername', searchUsersByUsername);

export default router;