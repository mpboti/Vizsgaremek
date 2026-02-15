import express from 'express';
import { getAllPlaylists, getPlaylistById, createPlaylist, addMusicToPlaylist, removeMusicFromPlaylist, deletePlaylist, updatePlaylist } from '../controllers/playlistController';
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get('/', getAllPlaylists);
router.get('/:id', getPlaylistById);
router.post('/', verifyToken, createPlaylist);
router.post('/addMusic', verifyToken, addMusicToPlaylist);
router.delete('/removeMusic', verifyToken, removeMusicFromPlaylist);
router.delete('/:id', verifyToken, deletePlaylist);
router.put('/:id', verifyToken, updatePlaylist);

export default router;