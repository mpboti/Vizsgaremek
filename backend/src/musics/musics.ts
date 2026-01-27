export interface IMusic {
    id: number | null;
    name: string;
    musicFileId: number;
    uploaderId: number;
}

export default class Music implements IMusic {
    id: number | null;
    name: string;
    musicFileId: number;
    uploaderId: number;

    constructor(init: IMusic) {
        this.id = init.id;
        this.name = init.name;
        this.musicFileId = init.musicFileId;
        this.uploaderId = init.uploaderId;
    }
}