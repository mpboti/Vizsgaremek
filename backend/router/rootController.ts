import { Request, Response } from "express";

export function root(_req: Request, res: Response){
    res.status(200).send("The server is on!")
}