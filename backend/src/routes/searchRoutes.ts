import express, { Router } from "express"
import { searchMusicsByName, searchPlaylistsByName, searchMusicByNameInPlaylist, searchUsersByUsername, searchAlbumsByName, searchMusicByNameInAlbum } from "../controllers/searchController";

const router: Router = express.Router();

router.get('/musicsByName', searchMusicsByName);
router.get('/usersByUsername', searchUsersByUsername);
router.get('/playlistsByName', searchPlaylistsByName);
router.get('/musicByNameInPlaylist', searchMusicByNameInPlaylist);
router.get('/albumsByName', searchAlbumsByName);
router.get('/musicByNameInAlbum', searchMusicByNameInAlbum);

export default router;