"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rootController_1 = require("./rootController");
const router = (0, express_1.Router)();
router.get('/', rootController_1.root);
exports.default = router;
