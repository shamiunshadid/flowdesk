import { Router } from "express";
import { createBoard, deleteBoard, getBoards, getSingleBoard, updateBoard } from "../../controllers/boards.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// create board
router.post("/", authMiddleware, createBoard);
// get all boards of a workspace
router.get("/workspace/:workspaceId", authMiddleware, getBoards);
// get single board
router.get("/:id", authMiddleware, getSingleBoard);
// update board
router.patch("/:id", authMiddleware, updateBoard);
// delete board
router.delete("/:id", authMiddleware, deleteBoard);

export default router;