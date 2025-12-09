"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Musics {
    constructor(init) {
        var _a, _b, _c;
        this.name = init.name;
        this.album_id = typeof init.album_id === "string" ? parseInt(init.album_id) : (_a = init.album_id) !== null && _a !== void 0 ? _a : null;
        this.mufaj_id = typeof init.mufaj_id === "string" ? parseInt(init.mufaj_id) : (_b = init.mufaj_id) !== null && _b !== void 0 ? _b : null;
        this.release_date = typeof init.release_date === "string" ? parseInt(init.release_date) : (_c = init.release_date) !== null && _c !== void 0 ? _c : null;
        this.music_path = init.music_path;
    }
}
exports.default = Musics;
