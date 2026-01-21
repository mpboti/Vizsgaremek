import { Request, Response } from "express";

export default function root(_req: Request, res: Response) {
    res.send("The server is running.");
};