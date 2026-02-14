export interface IAlbum {
    id: number | null;
    name: string;
    imageFileId: string | null;
    artistId: number | null;
}

export default class Album implements IAlbum {
    id: number | null;
    name: string;
    imageFileId: string | null;
    artistId: number | null;

    constructor(init: IAlbum) {
        this.id = init.id;
        this.name = init.name;
        this.imageFileId = init.imageFileId;
        this.artistId = init.artistId;
    }
}