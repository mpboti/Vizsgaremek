import express, { Router } from "express"
import { searchMusicsByName, searchPlaylistsByName, searchMusicByNameInPlaylist, searchUsersByUsername, searchMusicsByAlbum, searchMusicByNameInAlbum, searchMusicsByArtist, searchMusicByNameByArtist, searchAlbumsByNameByArtist, searchMusicsByUsername, searchPlaylistsByUsername } from "../controllers/searchController";

const router: Router = express.Router();

router.get('/musicsByName', searchMusicsByName);
router.get('/usersByUsername', searchUsersByUsername);
router.get('/playlistsByName', searchPlaylistsByName);
router.get('/musicByNameInPlaylist', searchMusicByNameInPlaylist);
router.get('/albumsByName', searchMusicsByAlbum);
router.get('/musicByNameInAlbum', searchMusicByNameInAlbum);
router.get('/artistsByName', searchMusicsByArtist);
router.get('/musicByNameByArtist', searchMusicByNameByArtist);
router.get('/albumsByNameByArtist', searchAlbumsByNameByArtist);
router.get('/musicsByUsername', searchMusicsByUsername);
router.get('/playlistsByUsername', searchPlaylistsByUsername);

export default router;