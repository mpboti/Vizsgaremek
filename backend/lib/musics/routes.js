"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const musicController_1 = require("./musicController");
const router = (0, express_1.Router)();
router.get('/musics', musicController_1.getAllMusics);
