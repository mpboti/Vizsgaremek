import express, {Router} from "express";
import root from "./rootController"

const router: Router = express.Router();

router.get('/', root);

export default router;