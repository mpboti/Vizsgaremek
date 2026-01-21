import express, {Router} from "express";
import root from "./rootController"
import musicsRouter from "../musics/musicsRoutes";
import usersRouter from "../users/usersRoutes";

const router: Router = express.Router();

router.get('/', root);
router.use('/musics', musicsRouter);
router.use('/users', usersRouter);

export default router;