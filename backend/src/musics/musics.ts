export interface IMusic {
    id: number | null;
    name: string;
    musicFileId: number;
    uploaderId: number;
    createdAt: null;
}

export default class Music implements IMusic {
    id: number | null;
    name: string;
    musicFileId: number;
    uploaderId: number;
    createdAt: null;

    constructor(init: IMusic) {
        this.id = init.id;
        this.name = init.name;
        this.musicFileId = init.musicFileId;
        this.uploaderId = init.uploaderId;
        this.createdAt = init.createdAt;
    }
}