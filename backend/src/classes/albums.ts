export interface IAlbum {
    id: number | null;
    name: string;
    imageId: string | null;
    artistId: number | null;
}

export default class Album implements IAlbum {
    id: number | null;
    name: string;
    imageId: string | null;
    artistId: number | null;

    constructor(init: IAlbum) {
        this.id = init.id;
        this.name = init.name;
        this.imageId = init.imageId;
        this.artistId = init.artistId;
    }
}

export interface IAlbumMusic {
    albumId: number;
    musicId: number;
    position: number;
}