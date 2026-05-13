import { db } from "../../lib/db"

interface createWorkspaceInput {
    name: string,
    userId: string
}

export const createWorkspaceService = async({name, userId}: createWorkspaceInput)=>{
    const workspace = await db.workspace.create({
        data: {
            name,
            members: {
                create: {
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    role: "OWNER"
                }
            }
        }
    })

    return workspace;
}

export const getMyWorkspacesService = async(userId:string)=>{
    const workspaces = await db.workspace.findMany({
        where: {
            members: {
                some: {
                    userId
                }
            }
        }
    })
    return workspaces;
}