export interface IMusics {
    id: number | undefined | null;
    name: string;
    release_date: number | undefined | null;
    music_path: string;
    album_id: number | undefined | null;
    mufaj_id: number | undefined | null;
}
export default class Musics implements IMusics {
    id: number | undefined | null;
    name: string;
    release_date: number | undefined | null;
    music_path: string;
    album_id: number | undefined | null;
    mufaj_id: number | undefined | null;
    constructor(init: IMusics);
}
