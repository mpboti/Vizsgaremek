import { Request, Response } from "express";
export declare function getAllMusics(_req: Request, res: Response): Promise<void>;
export declare function getMusicById(req: Request, res: Response): Promise<void>;
export declare function insertMusic(req: Request, res: Response): Promise<void>;
export declare function deleteMusicById(req: Request, res: Response): Promise<void>;
export declare function putMusicsById(req: Request, res: Response): Promise<void>;
