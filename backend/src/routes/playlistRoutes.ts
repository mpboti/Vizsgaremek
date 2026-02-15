import express from 'express';
import { getAllPlaylists, getPlaylistById, createPlaylist, addMusicToPlaylist, removeMusicFromPlaylist, deletePlaylist, updatePlaylist } from '../controllers/playlistController';
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get('/', getAllPlaylists);
router.get('/:id', getPlaylistById);
router.post('/', createPlaylist, verifyToken);
router.post('/addMusic', addMusicToPlaylist, verifyToken);
router.delete('/removeMusic', removeMusicFromPlaylist, verifyToken);
router.delete('/:id', deletePlaylist, verifyToken);
router.put('/:id', updatePlaylist, verifyToken);

export default router;