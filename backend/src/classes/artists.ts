export interface IArtist {
    id: number | null;
    name: string;
    imageFileId: string | null;
}

export default class Artist implements IArtist {
    id: number | null;
    name: string;
    imageFileId: string | null;

    constructor(init: IArtist) {
        this.id = init.id;
        this.name = init.name;
        this.imageFileId = init.imageFileId;
    }
}