import type { Request, Response } from "express";
import { createBoardService, deleteBoardService, getBoardsService, getSingleBoardService, updateBoardService } from "../services/boards.service";

// create board controller
export const createBoard = async (req: Request, res: Response) => {
  try {
    const { name, workspaceId } = req.body || {};
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: "false", message: "Unauthorized" });
      return;
    }

    if (!workspaceId) {
      res.status(400).json({ success: "false", message: "Workspace ID is required" });
      return;
    }

    if (!name) {
      res.status(400).json({ success: "false", message: "Board name is required" });
      return;
    }

    const board = await createBoardService({ name, workspaceId, userId });
    res.status(201).json({
      success: "true",
      message: "Board created successfully",
      board,
    });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const status = errorMessage.includes("access") || errorMessage.includes("Unauthorized") ? 403 : 500;

    res.status(status).json({
      success: "false",
      message: errorMessage,
      error: error,
    });
  }
};

// get all boards controller
export const getBoards = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const workspaceId = req.params.workspaceId as string;
    if(!userId){
      res.status(401).json({ success: "false", message: "Unauthorized" });
      return;
    }

    if(!workspaceId){
      res.status(400).json({ success: "false", message: "Workspace ID is required" });
      return;
    }
    const boards = await getBoardsService({ userId, workspaceId });
    res.status(200).json({
      success: "true",
      message: "Boards fetched successfully",
      boards,
    });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    const status = errorMessage.includes("access") || errorMessage.includes("Unauthorized") ? 403 : 500;

    res.status(status).json({
      success: "false",
      message: errorMessage,
      error: error,
    });
  }
};

// get single board controller
export const getSingleBoard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const boardId = req.params.id as string;

    if (!userId) {
      res.status(401).json({ success: "false", message: "Unauthorized" });
      return;
    }

    if (!boardId) {
      res.status(400).json({ success: "false", message: "Board ID is required" });
      return;
    }

    const board = await getSingleBoardService({ boardId, userId });
    res.status(200).json({
      success: "true",
      message: "Board fetched successfully",
      board,
    });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    let status = 500;
    if (errorMessage.includes("not found") || errorMessage.includes("found")) {
      status = 404;
    } else if (errorMessage.includes("access") || errorMessage.includes("Unauthorized")) {
      status = 403;
    }

    res.status(status).json({
      success: "false",
      message: errorMessage,
      error: error,
    });
  }
};

// update board controller
export const updateBoard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const boardId = req.params.id as string;
    const { name } = req.body || {};

    if (!userId) {
      res.status(401).json({ success: "false", message: "Unauthorized" });
      return;
    }

    if (!boardId) {
      res.status(400).json({ success: "false", message: "Board ID is required" });
      return;
    }

    if (!name) {
      res.status(400).json({ success: "false", message: "Board name is required" });
      return;
    }

    const board = await updateBoardService({ boardId, name, userId });
    res.status(200).json({
      success: "true",
      message: "Board updated successfully",
      board,
    });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    let status = 500;
    if (errorMessage.includes("not found") || errorMessage.includes("found")) {
      status = 404;
    } else if (errorMessage.includes("access") || errorMessage.includes("Unauthorized")) {
      status = 403;
    }

    res.status(status).json({
      success: "false",
      message: errorMessage,
      error: error,
    });
  }
};

// delete board controller
export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const boardId = req.params.id as string;

    if (!userId) {
      res.status(401).json({ success: "false", message: "Unauthorized" });
      return;
    }

    if (!boardId) {
      res.status(400).json({ success: "false", message: "Board ID is required" });
      return;
    }

    await deleteBoardService({ boardId, userId });
    res.status(200).json({
      success: "true",
      message: "Board deleted successfully",
    });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    let status = 500;
    if (errorMessage.includes("not found") || errorMessage.includes("found")) {
      status = 404;
    } else if (errorMessage.includes("access") || errorMessage.includes("Unauthorized")) {
      status = 403;
    }

    res.status(status).json({
      success: "false",
      message: errorMessage,
      error: error,
    });
  }
};
