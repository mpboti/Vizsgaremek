export interface IAlbum {
    id: number | null;
    name: string;
}

export default class Album implements IAlbum {
    id: number | null;
    name: string;

    constructor(init: IAlbum) {
        this.id = init.id;
        this.name = init.name;
    }
}