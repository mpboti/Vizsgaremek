import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import musicsRouter from "./routes/musicsRoutes";
import usersRouter from "./routes/usersRoutes";
import searchRouter from "./routes/searchRoutes";
import filesRouter from "./routes/filesRoutes";
import playlistRouter from "./routes/playlistRoutes";
import albumsRouter from "./routes/albumsRoutes";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

function root(_req: Request, res: Response) {
    res.status(200).send({ message: "The server is running." });
}

const router = express.Router();
router.get('/', root);
router.use('/musics', musicsRouter);
router.use('/users', usersRouter);
router.use('/search', searchRouter);
router.use('/files', filesRouter);
router.use('/playlists', playlistRouter);
router.use('/albums', albumsRouter);

app.use(router);

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});