import express, {Router} from "express";
import root from "./rootController"
import musicsRouter from "../musics/musicsRoutes";
import usersRouter from "../users/usersRoutes";
import searchRouter from "../search/searchRoutes";
import uploadRouter from "../files/filesRoutes";

const router: Router = express.Router();

router.get('/', root);
router.use('/musics', musicsRouter);
router.use('/users', usersRouter);
router.use('/search', searchRouter);
router.use('/files', uploadRouter);

export default router;