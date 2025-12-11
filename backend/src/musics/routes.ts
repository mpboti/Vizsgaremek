import { Router } from "express"
import { getAllMusics } from "./musicsController"

const router: Router = Router()

router.get('/musics', getAllMusics)