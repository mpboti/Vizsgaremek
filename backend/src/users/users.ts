export interface IUsers {
    id: number | null;
    username: string;
    email: string;
    pwd: string;
}

export default class Users implements IUsers {
    id: number | null;
    username: string;
    email: string;
    pwd: string;

    constructor(init: IUsers) {
        this.id = init.id;
        this.username = init.username;
        this.email = init.email;
        this.pwd = init.pwd;
    }
}