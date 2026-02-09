import express, { Router } from "express"
import { searchMusicsByName, searchPlaylistsByName, searchPlaylistsByNameOfCreatorId, searchUsersByUsername } from "./searchController";

const router: Router = express.Router();

router.get('/musicsByName', searchMusicsByName);
router.get('/usersByUsername', searchUsersByUsername);
router.get('/playlistsByName', searchPlaylistsByName);
router.get('/playlistsByNameOfCreatorId', searchPlaylistsByNameOfCreatorId);

export default router;