export interface IAlbum {
    id: number | null;
    name: string;
    imageFileId: number | null;
    externalLink: string | null;
    releaseDate: number | null;
    artistId: number;
}

export default class Album implements IAlbum {
    id: number | null;
    name: string;
    imageFileId: number | null;
    externalLink: string | null;
    releaseDate: number | null;
    artistId: number;

    constructor(init: IAlbum) {
        this.id = init.id;
        this.name = init.name;
        this.imageFileId = init.imageFileId;
        this.externalLink = init.externalLink;
        this.releaseDate = init.releaseDate;
        this.artistId = init.artistId;
    }
}