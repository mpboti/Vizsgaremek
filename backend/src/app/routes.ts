import express, {Router} from "express";
import root from "./rootController"
import musicsRouter from "../musics/musicsRoutes";

const router: Router = express.Router();

router.get('/', root);
router.use('/musics', musicsRouter);

export default router;