export interface IArtist {
    id: number | null;
    name: string;
}

export default class Artist implements IArtist {
    id: number | null;
    name: string;

    constructor(init: IArtist) {
        this.id = init.id;
        this.name = init.name;
    }
}