import { Response, Request } from "express";
import config from "../config/config";
import Settings, { ISettings } from "../classes/settings";

export async function getAllSettings(_req: Request, res: Response){
    const conn: any = await config.connection;
    try {
        const [results]: any = await conn.query("SELECT * FROM user_settings")
        if (results.length === 0){
            res.status(204).json({ message: "There are no settings." })
        }
        res.status(200).json(results)
    } catch (err){
        console.error(err)
        res.status(500).json({ message: "Internal server error." })
    }
    return;
}

export async function getSettingsById(req: Request, res: Response){
    if(!req.body){
        res.status(400).json({ message: "No data recieved." })
    }

    const id: number = parseInt(req.params.userId as string);
    if(isNaN(id)){
        res.status(400).json({ message: "Invalid user id." })
    }

    const conn: any = await config.connection;
    try{
        const [results]: any = await conn.query("SELECT * FROM user_settings WHERE userId = ?", [id]);
        if (results.length === 0){
            res.status(204).json({ message: "There are no settings." })
        } 
        res.status(200).json(results);
    } catch (err){
        console.error(err)
        res.status(500).json({ message: "Internal server error." })
    }
    return;
}

export async function updateSettingsById(req: Request, res: Response) {
    if(!req.body){
        res.status(400).json({ message: "No data recieved." })
    }

    const id: number = parseInt(req.params.userId as string);
    if(isNaN(id)){
        res.status(400).json({ message: "Invalid user id." })
    }

    const body: Partial<ISettings> = req.body as Partial<ISettings>;
    const setting: any = new Settings(body as ISettings)
    const allowedFields: string[] = ["volume", "fadeValue", "lastMusicId", "lastPlaylistId"];
    const keys: string[] = Object.keys(body).filter(key => allowedFields.includes(key));
    if (keys.length === 0){
        return res.status(400).json({ message: "No valid fields to update." });
    }

    const updateString: string = keys.map(key => `${key} = ?`).join(', ');
    const values = keys.map(key => (setting)[key]);
    values.push(id)

    const conn: any = await config.connection;
    try{
        const [results]: any = conn.query(`UPDATE user_settings SET ${updateString} WHERE id = ?`, values);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Setting not found." });
        }
        res.status(200).json({ message: "Settings updated successfully." });
        return;
    } catch (err){
        console.error(err)
        res.status(500).json({ message: "Internal server error." })
    }
    return;
}