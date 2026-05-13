import { Router } from "express";
import { createWorkspace, getMyWorkspaces } from "../../controllers/workspace.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createWorkspace);
router.get("/", authMiddleware, getMyWorkspaces);

export default router;