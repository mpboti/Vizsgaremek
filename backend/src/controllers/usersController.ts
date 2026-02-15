import { Request, Response } from "express";
import config from "../config/config";
import Users, { IUsers } from "../classes/users";
import jwt from 'jsonwebtoken';

export async function logIn(req: Request, res: Response) {
    const { email, pwd } = req.body;

    if (!email || !pwd) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const conn = await config.connection;
    try {
        const [results] = await conn.query("SELECT login (?, ?) AS id", [email, pwd]);
        if (results.length === 0 || results[0].id === null || results[0].id <= 0) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        if(!config.jwtSecret) {
            throw new Error("JWT secret is not defined in the configuration.");
        }
        const token = jwt.sign({ id: results[0].id, username: email }, config.jwtSecret, { expiresIn: '1d' });
        res.status(200).json({ message: "Login successful.", token: token, id: results[0].id });
        return;
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
}

export async function getAllUsers(_req: Request, res: Response) {
    const conn = await config.connection;

    try {
        const [results] = await conn.query("SELECT * FROM users");
        if (results.length === 0) {
            res.status(404).json({ message: "No users found." });
            return;
        }
        res.status(200).json(results);
        return;
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function getUserById(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID." });
    }

    const conn = await config.connection;

    try {
        const [results] = await conn.query("SELECT * FROM users WHERE id = ?", [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(results[0]);
        return;
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function createUser(req: Request, res: Response) {
    if (!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }

    const user = new Users(req.body as unknown as IUsers);

    if (user.username === undefined || user.email === undefined || user.pwd === undefined ||
        user.username === null || user.email === null || user.pwd === null ||
        user.username === "" || user.email === "" || user.pwd === "") {
        return res.status(400).json({ message: "Invalid user data." });
    }
    const conn = await config.connection;

    try {
        const [results] = await conn.query("INSERT INTO users (id, username, email, pwd, imageFileId) VALUES (null, ?, ?, ?, null)", [user.username, user.email, user.pwd]);
        res.status(201).json({ message: "User created successfully.", id: results.insertId });
        return;
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function deleteUser(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID." });
    }

    const conn = await config.connection;

    try {
        const [results] = await conn.query("DELETE FROM users WHERE id = ?", [id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ message: "User deleted successfully." });
        return;
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export async function updateUser(req: Request, res: Response) {
    const id: number = parseInt(req.params.id as string);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID." });
    }

    if (!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
    }

    const user: any = new Users(req.body as unknown as IUsers);
    const allowedFields = ["username", "email", "pwd", "imageFileId"];
    const keys = Object.keys(user).filter(key => allowedFields.includes(key));

    if (keys.length === 0) {
        return res.status(400).json({ message: "No valid fields to update." });
    }

    const updateString = keys.map(key => `${key} = ?`).join(", ");
    const values = keys.map(key => (user)[key]);
    values.push(id); // For WHERE clause

    const conn = await config.connection;
    try {
        const [results] = await conn.query(`UPDATE users SET ${updateString} WHERE id = ?`, values);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ message: "User updated successfully." });
        return;
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
}