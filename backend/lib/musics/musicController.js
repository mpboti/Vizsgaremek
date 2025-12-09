"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMusics = getAllMusics;
exports.getMusicById = getMusicById;
exports.insertMusic = insertMusic;
exports.deleteMusicById = deleteMusicById;
exports.putMusicsById = putMusicsById;
const config_1 = __importDefault(require("../config/config"));
const musics_1 = __importDefault(require("./musics"));
function getAllMusics(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield config_1.default.connection;
        try {
            const [results] = yield conn.query('SELECT * FROM musics');
            if (results.length === 0) {
                "There are no musics.";
                return;
            }
            res.status(200).send(results);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function getMusicById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).send("Id must be a number.");
        }
        const conn = yield config_1.default.connection;
        try {
            const [results] = yield conn.query('SELECT * FROM musics WHERE id = ?', [id]);
            if (results.length === 0) {
                "Music doesn't exist.";
                return;
            }
            res.status(200).send(results);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function insertMusic(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body) {
            res.status(400).send("No data was given.");
            return;
        }
        const music = new musics_1.default(req.body);
        if (music.name === null || music.name === undefined || music.name === "") {
            res.status(400).send("Name not given.");
            return;
        }
        const conn = yield config_1.default.connection;
        try {
            const [results] = yield conn.query('INSERT INTO musics VALUES (null,?,?,?)', [music.name, music.album_id, music.mufaj_id]);
            res.status(201).send(music);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function deleteMusicById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).send("Id must be a number.");
        }
        const conn = yield config_1.default.connection;
        try {
            const [results] = yield conn.query('DELETE FROM musics WHERE id =?', [id]);
            res.status(200);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function putMusicsById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).send("Id must be a number.");
        }
        if (!req.body) {
            res.status(400).send("No data was given.");
            return;
        }
        let reqMusics = new musics_1.default(req.body);
        const allowedFields = ['name', 'album_id', 'mufaj_id'];
        const keys = Object.keys(reqMusics).filter(key => allowedFields.includes(key));
        if (keys.length === 0) {
            res.status(400).send("No fields to be updated.");
            return;
        }
        const updateString = keys.map(key => `${key} = ?`).join(',');
        const values = keys.map(key => reqMusics[key]);
        values.push(id);
        const sqlQuery = `UPDATE musics SET ${updateString} WHERE id = ?`;
    });
}
