export interface IMusics{
    id: number | undefined | null,
    name: string,
    album_id: number | undefined | null,
    mufaj_id: number | undefined | null
}

export default class Musics implements IMusics{
    id: number | undefined | null
    name: string
    album_id: number | undefined | null
    mufaj_id : number | undefined | null
    
    constructor(init: IMusics) {
        this.name = init.name
        this.album_id = typeof init.album_id === "string" ? parseInt(init.album_id) : init.album_id ?? null
        this.mufaj_id = typeof init.mufaj_id === "string" ? parseInt(init.mufaj_id) : init.mufaj_id ?? null
    }
}