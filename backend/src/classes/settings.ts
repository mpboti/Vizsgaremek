export interface ISettings{
    userId: number
    volume: number
    fadeValue: number
    lastMusicId: number
    lastPlaylistId: number
}

export default class Settings implements ISettings{
    userId: number;
    volume: number;
    fadeValue: number;
    lastMusicId: number;
    lastPlaylistId: number;

    constructor(init: ISettings){
        this.userId = init.userId;
        this.volume = init.volume;
        this.fadeValue = init.fadeValue;
        this.lastMusicId = init.lastMusicId;
        this.lastPlaylistId = init.lastPlaylistId;
    }
}