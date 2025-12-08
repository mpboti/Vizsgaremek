import { Router } from "express"
import { getAllMusics } from "./musicController"

const router: Router = Router()

router.get('/musics', getAllMusics)