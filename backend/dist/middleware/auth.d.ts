import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    participantId?: number;
    studentId?: string;
}
export declare function authenticate(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function signToken(participantId: number, studentId: string): string;
