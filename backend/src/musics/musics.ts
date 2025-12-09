export interface IMusics{
    id: number | undefined | null
    name: string
    release_date: number | undefined | null
    music_path: string
    album_id: number | undefined | null
    mufaj_id: number | undefined | null
}

export default class Musics implements IMusics{
    id: number | undefined | null
    name: string
    release_date: number | undefined | null
    music_path: string
    album_id: number | undefined | null
    mufaj_id : number | undefined | null
    
    constructor(init: IMusics) {
        this.name = init.name
        this.album_id = typeof init.album_id === "string" ? parseInt(init.album_id) : init.album_id ?? null
        this.mufaj_id = typeof init.mufaj_id === "string" ? parseInt(init.mufaj_id) : init.mufaj_id ?? null
        this.release_date = typeof init.release_date === "string" ? parseInt(init.release_date) : init.release_date ?? null
        this.music_path = init.music_path
    }
}