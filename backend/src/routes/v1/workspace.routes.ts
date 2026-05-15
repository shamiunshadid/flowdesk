import { Router } from "express";
import { createWorkspace, deleteWorkspace, getMyWorkspaces, getWorkspace, updateWorkspace } from "../../controllers/workspace.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createWorkspace);
router.get("/", authMiddleware, getMyWorkspaces);
router.get("/:id", authMiddleware, getWorkspace);
router.patch("/:id", authMiddleware, updateWorkspace);
router.delete("/:id", authMiddleware, deleteWorkspace);

export default router;