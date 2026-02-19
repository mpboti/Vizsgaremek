export interface IUsers {
    id: number | null;
    username: string;
    email: string;
    imageFileId: string | null;
    pwd: string;
}

export default class Users implements IUsers {
    id: number | null;
    username: string;
    email: string;
    imageFileId: string | null;
    pwd: string;

    constructor(init: IUsers) {
        this.id = init.id;
        this.username = init.username;
        this.email = init.email;
        this.imageFileId = init.imageFileId;
        this.pwd = init.pwd;
    }
}