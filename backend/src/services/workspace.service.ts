import { db } from "../../lib/db";

interface createWorkspaceInput {
  name: string;
  userId: string;
}

// create workspace
export const createWorkspaceService = async ({
  name,
  userId,
}: createWorkspaceInput) => {
  const workspace = await db.workspace.create({
    data: {
      name,
      members: {
        create: {
          user: {
            connect: {
              id: userId,
            },
          },
          role: "OWNER",
        },
      },
    },
  });

  return workspace;
};


// get my workspaces
export const getMyWorkspacesService = async (userId: string) => {
  const workspaces = await db.workspace.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
  });
  return workspaces;
};


// get single workspace
export const getWorkspaceService = async (
  workspaceId: string,
  userId: string,
) => {
  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });
  return workspace;
};


// update workspace
export const updateWorkspaceService = async (
  name: string,
  workspaceId: string,
) => {
  const workspace = await db.workspace.update({
    where: {
      id: workspaceId,
    },
    data: {
      name,
    },
  });
  return workspace;
};


// delete workspace
export const deleteWorkspaceService = async (
  userId: string,
  workspaceId: string,
) => {
  const workspace = await db.workspace.delete({
    where: {
      id: workspaceId,
      members: {
        some: {
          userId,
        },
      },
    },
  });
  return workspace;
};
