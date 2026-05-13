import type { Request, Response, NextFunction } from "express";
import { auth } from "../../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }

    req.user = session.user;
    req.session = session.session;
    next();
};
