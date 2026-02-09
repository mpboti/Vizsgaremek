import express from 'express';
import { getAllPlaylists, getPlaylistById, createPlaylist, addMusicToPlaylist, removeMusicFromPlaylist, deletePlaylist, updatePlaylist } from './playlistController';
import { logIn } from "../users/usersController";

const router = express.Router();

router.get('/', getAllPlaylists);
router.get('/:id', getPlaylistById);
router.post('/', createPlaylist, logIn);
router.post('/addMusic', addMusicToPlaylist, logIn);
router.delete('/removeMusic', removeMusicFromPlaylist, logIn);
router.delete('/:id', deletePlaylist, logIn);
router.put('/:id', updatePlaylist, logIn);

export default router;