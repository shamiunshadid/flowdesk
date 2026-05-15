import type { Request, Response } from "express";
import { createWorkspaceService, deleteWorkspaceService, getMyWorkspacesService, getWorkspaceService, updateWorkspaceService } from "../services/workspace.service";

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


// get single workspace
export const getWorkspace = async(req: Request, res: Response)=>{
  try {
    const workspaceId = req.params.id as string;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: "false", message: "Unauthorized" });
      return;
    }

    if (!workspaceId) {
      res.status(400).json({ success: "false", message: "Workspace ID is required" });
      return;
    }

    const workspace = await getWorkspaceService(workspaceId, userId);
    res.status(200).json({
      success: "true",
      message: "Workspace fetched successfully",
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
}


// update workspace
export const updateWorkspace = async(req: Request, res: Response)=>{
  try {
    const { name } = req.body;
    const workspaceId = req.params.id as string;
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

    if (!workspaceId) {
      res.status(400).json({ success: "false", message: "Workspace ID is required" });
      return;
    }

    const workspace = await updateWorkspaceService(name, workspaceId);
    res.status(200).json({
      success: "true",
      message: "Workspace updated successfully",
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
}


// delete workspace
export const deleteWorkspace = async(req: Request, res: Response)=>{
  try {
    const workspaceId = req.params.id as string;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: "false", message: "Unauthorized" });
      return;
    }

    if (!workspaceId) {
      res.status(400).json({ success: "false", message: "Workspace ID is required" });
      return;
    }

    await deleteWorkspaceService(userId, workspaceId);
    res.status(200).json({
      success: "true",
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: "false",
      message: "Internal server error",
      error: error,
    });
  }
}
