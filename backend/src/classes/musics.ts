export interface IMusic {
    id: number | null;
    name: string;
    albumId: number | null;
    artistId: number | null;
    musicFileId: string;
    uploaderId: number;
}

export default class Music implements IMusic {
    id: number | null;
    name: string;
    albumId: number | null;
    artistId: number | null;
    musicFileId: string;
    uploaderId: number;

    constructor(init: IMusic) {
        this.id = init.id;
        this.name = init.name;
        this.albumId = init.albumId;
        this.artistId = init.artistId;
        this.musicFileId = init.musicFileId;
        this.uploaderId = init.uploaderId;
    }
}