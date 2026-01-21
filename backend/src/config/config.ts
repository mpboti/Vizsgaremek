import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

class DBConfig {
    constructor() {
        return mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DATABASE || 'slicetune',
        })
    }
}

const config: any = {
    connection: new DBConfig(),
}

export default config;