import type { Request, Response } from "express";
import { createWorkspaceService, getMyWorkspacesService } from "../services/workspace.service";

// create workspace controller
export const createWorkspace = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: "false", message: "Unauthorized" });
      return;
    }

    if (!name) {
      res
        .status(400)
        .json({ success: "false", message: "Workspace name is required" });
      return;
    }

    const workspace = await createWorkspaceService({ name, userId });
    res.status(201).json({
      success: "true",
      message: "Workspace created successfully",
      workspace,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: "false",
      message: "Internal server error",
      error: error,
    });
  }
};

// get user workspaces
export const getMyWorkspaces = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: "false", message: "Unauthorized" });
      return;
    }

    const workspaces = await getMyWorkspacesService(userId);
    
    res.status(200).json({
      success: "true",
      message: "Workspaces fetched successfully",
      workspaces,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: "false",
      message: "Internal server error",
      error: error,
    });
  }
};
