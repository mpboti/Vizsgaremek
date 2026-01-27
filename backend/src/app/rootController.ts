import { Request, Response } from "express";

export default function root(_req: Request, res: Response) {
    res.status(200).send({message: "The server is running."});
};