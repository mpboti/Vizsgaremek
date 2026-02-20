import { Request, Response } from "express";
import config from "../config/config";
import Users, { IUsers } from "../classes/users";
import jwt from 'jsonwebtoken';
import { safeUnlink } from "../utils/fileUtils";

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
        const token = jwt.sign({ id: results[0].id, username: email }, config.jwtSecret, { expiresIn: '2h' });
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
        const [results] = await conn.query("SELECT users.id, users.username, users.email, users.imageFileId, image_files.fileName, image_files.mimeType, image_files.filePath  FROM users INNER JOIN image_files ON image_files.id = users.imageFileId WHERE users.id = ?", [id]);
        if (results.length === 0) {
            const [results2] = await conn.query("SELECT users.id, users.username, users.email FROM users WHERE id = ?", [id]);
            if (results2.length === 0) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json({...results2[0], url: null});
        }else{
            
            res.status(200).json({...results[0], url: (results[0].filePath).slice(config.baseDir.length)});
        }
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
        await conn.query("INSERT INTO user_settings (userId, volume, fadeValue, lastMusicId, lastPlaylistId) VALUES (?, DEFAULT, DEFAULT, NULL, NULL)",[results.insertId]);
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
        await conn.beginTransaction();

        // find user's profile image file (if any)
        const [userRows] = await conn.query("SELECT imageFileId FROM users WHERE id = ?", [id]);
        if (!userRows || userRows.length === 0) {
            await conn.rollback();
            return res.status(404).json({ message: "User not found." });
        }
        const imageFileId = userRows[0].imageFileId as number | null;

        // delete user
        const [results] = await conn.query("DELETE FROM users WHERE id = ?", [id]);
        if (results.affectedRows === 0) {
            await conn.rollback();
            return res.status(404).json({ message: "User not found." });
        }

        let filePath: string | null = null;
        if (imageFileId) {
            const [fileRows] = await conn.query("SELECT filePath FROM image_files WHERE id = ?", [imageFileId]);
            if (fileRows && fileRows.length > 0) filePath = fileRows[0].filePath as string;
            await conn.query("DELETE FROM image_files WHERE id = ?", [imageFileId]);
        }

        await conn.commit();

        if (filePath) {
            safeUnlink(filePath).catch(err => console.error('Failed to unlink user image:', filePath, err));
        }

        res.status(200).json({ message: "User deleted successfully." });
        return;
    } catch (error) {
        await conn.rollback();
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

    const updateString = keys.map(key => {if(user[key]!=null && user[key]!="") return `${key} = ?`; else return null;}).filter(value => value !== null).join(", ");
    const values = keys.map(key => {if(user[key]!=null && user[key]!="") return user[key]; else return null;}).filter(value => value !== null);
    values.push(id); // For WHERE clause
    console.log("Update string: ", updateString);
    console.log(req.body);
    const conn = await config.connection;
    try {
        if(updateString.includes("pwd = ?")){
            const [pwdResults] = await conn.query("SELECT pwd_encrypt(?) AS encryptedPwd", [user.pwd]);
            values[updateString.indexOf("pwd = ?")] = pwdResults[0].encryptedPwd;
        }
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

export async function passwordCheck(req: Request, res:Response){
    const { userid, pwd } = req.body;

    if (!userid || !pwd)
        return res.status(400).json({ message: "User id and password are required." });

    const conn = await config.connection;
    try {
        const [passwords] = await conn.query("SELECT pwd_encrypt(?) AS userpass", [pwd]);
        const [userpasswords] = await conn.query("SELECT pwd AS validpwd FROM users WHERE id = ?", [userid]);
        if (passwords[0].userpass !== userpasswords[0].validpwd) {
            return res.status(401).json({ message: "Invalid password.", samePass: false });
        }else if(passwords[0].userpass === userpasswords[0].validpwd){
            res.status(200).json({ message: "Passwords match.", samePass: true })
        }else{
            res.status(500).json({ message: "Unexpected error during password check." });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error." })
    }
    return;
}