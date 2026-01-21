export interface IUsers {
    id: number | null;
    username: string;
    email: string;
    pwd: string;
    createdAt: null;
}

export default class Users implements IUsers {
    id: number | null;
    username: string;
    email: string;
    pwd: string;
    createdAt: null;

    constructor(init: IUsers) {
        this.id = init.id;
        this.username = init.username;
        this.email = init.email;
        this.pwd = init.pwd;
        this.createdAt = init.createdAt;
    }
}