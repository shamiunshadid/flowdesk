import { db } from "../../lib/db";

// Common base types to keep code DRY and professional
interface BaseBoardInput {
  userId: string;
}

interface WorkspaceActionInput extends BaseBoardInput {
  workspaceId: string;
}

interface BoardActionInput extends BaseBoardInput {
  boardId: string;
}

export interface CreateBoardInput extends WorkspaceActionInput {
  name: string;
}

// create board service
export const createBoardService = async ({
  name,
  workspaceId,
  userId,
}: CreateBoardInput) => {
  // step 1: check the workspace exists and the user is mermber of it
  const workspaceExistsAndIsHeTheMember = await db.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
    },
  });

  if (!workspaceExistsAndIsHeTheMember) {
    throw new Error(
      "you do not have access to this workspace or workspace does not exist",
    );
  }

  // step 2: create a board
  const board = await db.board.create({
    data: {
      name,
      workspaceId,
      userId,
    },
  });
  return board;
};

export type GetBoardsInput = WorkspaceActionInput;

// get boards service
export const getBoardsService = async ({ userId, workspaceId }: GetBoardsInput) => {
  const isUserMemberOfWorkspace = await db.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
    },
  });

  if(!isUserMemberOfWorkspace){
    throw new Error("you do not have access to this workspace or workspace does not exist");
  }
  
  const boards = await db.board.findMany({
    where: {
      workspaceId,
      userId,
    },
    
  });
  return boards;
};

export type GetSingleBoardInput = BoardActionInput;

// get single board service
export const getSingleBoardService = async ({ boardId, userId }: GetSingleBoardInput) => {
  const board = await db.board.findUnique({
    where: { id: boardId },
  });

  if (!board) {
    throw new Error("Board not found");
  }

  const isMember = await db.workspaceMember.findFirst({
    where: {
      workspaceId: board.workspaceId,
      userId,
    },
  });

  if (!isMember) {
    throw new Error("you do not have access to this board");
  }

  return board;
};

export interface UpdateBoardInput extends BoardActionInput {
  name: string;
}

// update board service
export const updateBoardService = async ({ boardId, name, userId }: UpdateBoardInput) => {
  const board = await db.board.findUnique({
    where: { id: boardId },
  });

  if (!board) {
    throw new Error("Board not found");
  }

  const isMember = await db.workspaceMember.findFirst({
    where: {
      workspaceId: board.workspaceId,
      userId,
    },
  });

  if (!isMember) {
    throw new Error("you do not have access to this board");
  }

  const updatedBoard = await db.board.update({
    where: { id: boardId },
    data: { name },
  });

  return updatedBoard;
};

export type DeleteBoardInput = BoardActionInput;

// delete board service
export const deleteBoardService = async ({ boardId, userId }: DeleteBoardInput) => {
  const board = await db.board.findUnique({
    where: { id: boardId },
  });

  if (!board) {
    throw new Error("Board not found");
  }

  const isMember = await db.workspaceMember.findFirst({
    where: {
      workspaceId: board.workspaceId,
      userId,
    },
  });

  if (!isMember) {
    throw new Error("you do not have access to this board");
  }

  await db.board.delete({
    where: { id: boardId },
  });

  return board;
};
