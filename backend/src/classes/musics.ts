export interface IMusic {
    id: number | null;
    name: string;
    artistId: number | null;
    albumId: number | null;
    musicFileId: string;
    uploaderId: number;
}

export default class Music implements IMusic {
    id: number | null;
    name: string;
    artistId: number | null;
    albumId: number | null;
    musicFileId: string;
    uploaderId: number;

    constructor(init: IMusic) {
        this.id = init.id;
        this.name = init.name;
        this.artistId = init.artistId;
        this.albumId = init.albumId;
        this.musicFileId = init.musicFileId;
        this.uploaderId = init.uploaderId;
    }
}