export interface IPlaylist {
    id: number | null;
    name: string;
    creatorId: number;
    musicIds: number[];
}

export class Playlist implements IPlaylist {
    id: number | null;
    name: string;
    creatorId: number;
    musicIds: number[];

    constructor(init: IPlaylist) {
        this.id = init.id;
        this.name = init.name;
        this.creatorId = init.creatorId;
        this.musicIds = init.musicIds;
    }
}

export interface IPlaylistMusics {
    playlistId: number;
    musicId: number;
    position: number;
}

export class PlaylistMusics implements IPlaylistMusics {
    playlistId: number;
    musicId: number;
    position: number;

    constructor(init: IPlaylistMusics) {
        this.playlistId = init.playlistId;
        this.musicId = init.musicId;
        this.position = init.position;
    }
}