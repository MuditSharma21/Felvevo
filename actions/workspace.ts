"use server"

import { db } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { Prisma } from '@prisma/client';
import { sendEmail } from "./user";


export const verifyAccessToWorkspace = async (workspaceId: string) => {
    try {
        const user = await currentUser()
        if (!user) {
            return { status: 401, message: 'User not authenticated' }
        }
        const isUserInWorkspace = await db.workspace.findUnique({
            where: {
                id: workspaceId,
                OR: [
                    {
                        User: {
                            clerkid: user.id
                        }
                    },
                    {
                        members: {
                            every: {
                                User: {
                                    clerkid: user.id
                                }
                            }
                        }
                    }
                ]
            }
        })
        if (isUserInWorkspace) {
            return {
                status: 200,
                data: { workspace: isUserInWorkspace }
            }
        } else {
            return { status: 403, message: 'Forbidden: User does not have access to the workspace' }
        }
    } catch (e) {
        return { status: 500, message: 'Internal Server Error', error: e instanceof Error ? e.message : 'Unknown error' }
    }
}


export const getWorkspaceFolders = async (workspaceId: string) => {
    try {
        const isFolders = await db.folder.findMany({
            where: {
                workspaceId,
            },
            include: {
                _count: {
                    select: {
                        videos: true
                    }
                }
            }
        })
        if (isFolders && isFolders.length > 0) {
            return { status: 200, data: isFolders }
        }
        return { status: 404, data: [] }
    }  catch (e) {

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return { status: 500, data: [], message: 'Database error' };
        }
        if (e instanceof Prisma.PrismaClientInitializationError) {
            return { status: 500, data: [], message: 'Database connection error' };
        }
        return { status: 403, data: [], message: 'An unknown error occurred' }
    }
}



export const getAllUserVideos = async ( workspaceId: string ) => {
    try {
        const user = await currentUser()
        if (!user) {
            return { status: 404, message: "User not found" };
        }

        const videos = await db.video.findMany({
            where: {
                OR: [
                    { workspaceId },
                    { folderId: workspaceId }
                ]
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                source: true,
                processing: true,
                Folder: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                User: {
                    select: {
                        firstname: true,
                        lastname: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'   //ascending order
            }
        })

        if (videos && videos.length > 0) {
            return { status: 200, data: videos }
        }
        return { status: 404, data: 'No videos found' }
    } catch (e) {
        return { status: 500, data: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' 
        }
    }
}



export const getUserWorkspaces = async () => {
    try {
        const user = await currentUser()

        if (!user) {
            return { status: 404, message: "User not found" };
        }

        const workspaces = await db.user.findUnique({
            where: {
                clerkid: user.id
            },
            select: {
                subscription: {
                    select: {
                        plan: true
                    }
                },
                workspace: {
                    select: {
                        id: true,
                        name: true,
                        type: true
                    }
                },
                members: {
                    select: {
                        Workspace: {
                            select: {
                                id: true,
                                name: true,
                                type: true
                            }
                        }
                    }
                }
            }
        })

        if (!workspaces || (!workspaces.workspace && !workspaces.members)) {
            return { status: 404, data: 'Workspaces not found' }
        }
        return { status: 200, data: workspaces }

    } catch (e) {
        return { status: 500, data: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' }
    }
}



export const createWorkspace = async (name: string) => {
    try {
        const user = await currentUser()
        if (!user) {
            return { status: 404, message: "User not found" };
        }
        const authorized = await db.user.findUnique({
            where: {
                clerkid: user.id
            },
            select: {
                subscription: {
                    select: {
                        plan: true
                    }
                }
            }
        })

        if (authorized?.subscription?.plan === 'PREMIUM') {
            const workspace = await db.user.update({
                where: {
                    clerkid: user.id
                },
                data: {
                    workspace: {
                        create: {
                            name,
                            type: 'PUBLIC',
                        }
                    }
                }
            })
            if (workspace) {
                return { status: 201, data: 'Workspace created' }
            }
        }
        return { status: 401, data: 'You are not authorized to create a workspace' }
    } catch (e) {
        return { status: 500, data: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' }
    }
}



export const renameFolders = async (folderId: string, name: string)=> {
    try {
        const folder = await db.folder.update({
            where: {
                id: folderId
            },
            data: {
                name
            }
        })
        if (folder) {
            return { status: 200, data: 'Folder Renamed' }
        }
        return { status: 400, data: 'Folder does not exist' }
    } catch (e) {
        return { status: 500, data: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' }
    }
}



// export const createFolder = async (workspaceId: string) => {
//     try {
//         const isNewFolder = await db.workspace.update({
//             where: { id: workspaceId },
//             data: {
//                 folders: {
//                     create: {
//                         name: 'Untitled',
//                     }
//                 }
//             }
//         });

//         if (isNewFolder) {
//             return { status: 200, data: 'New Folder Created', data: { ...folderData } };
//         }
//         return { status: 400, data: 'Could not create folder' };
//     } catch (e) {
//         console.error('Error creating folder:', e); // Log the error to the server console
//         return { status: 500, data: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' };
//     }
// }


export const createFolder = async (workspaceId: string) => {
    try {        
        const isNewFolder = await db.folder.create({
            data: {
                name: 'Untitled',
                workspaceId
            },
        });

        if (isNewFolder) {
            return { status: 200, data: 'New Folder Created' };
        }
        return { status: 400, data: 'Could not create folder' };
    } catch (e) {
        console.error('Error creating folder:', e);
        return { status: 500, data: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' };
    }
};




export const getFolderInfo = async (folderId: string) => {
    try {
        const folder = await db.folder.findUnique({
            where: {
                id: folderId
            },
            select: {
                name: true,
                _count: {
                    select: {
                        videos: true
                    }
                }
            }
        })
        if (folder) {
            return { status: 200, data: folder }
        }
        return { status: 400, data: null }
    } catch (e) {
        return { status: 500, msg: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' , data: null}
    }
}



export const moveVideoLocation = async (videoId: string, workspaceId: string, folderId: string) => {
    try { 
        const location = await db.video.update({
            where: {
                id: videoId
            },
            data: {
                folderId: folderId || null,
                workspaceId
            }
        })

        if (location) {
            return { status: 200, data: 'Folder changed successffully' }
        }
        return { status: 404, data: 'Workspace or Folder not found' }
    } catch (e) {
        return { status: 500, msg: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' , data: null}
    }
}



export const getPreviewVideo = async (videoId: string) => {
    try {
        const user = await currentUser()
        if (!user) {
            return { status: 404, message: "User not found" };
        }

        const video = await db.video.findUnique({
            where: {
                id: videoId
            },
            select: {
                title: true,
                createdAt: true,
                source: true,
                description: true,
                processing: true,
                views: true,
                summery: true,
                User: {
                    select: {
                        firstname: true,
                        lastname: true,
                        image: true,
                        clerkid: true,
                        trial: true,
                        subscription: {
                            select: {
                                plan: true
                            }
                        }
                    }
                }
            }
        })

        if (video) {
            return { status: 200, data: video, author: user.id === video.User?.clerkid ? true : false }
        }
        return { status: 404 }
    } catch (e) {
        return { status: 500, data: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' }
    }
}



export const sendEmailForFirstView = async (videoId: string) => {
    // TODO: Fix multiple first view email being sent
    try {
        const user = await currentUser()
        if (!user) return { status: 404, message: 'User Not Found' }

        const firstViewSettings = await db.user.findUnique({
            where: {
                clerkid: user.id
            },
            select: {
                firstView: true
            }
        })

        if (!firstViewSettings?.firstView) return { status: 404 }
        
        const video =  await db.video.findUnique({
            where: {
                id: videoId
            },
            select: {
                title: true,
                views: true,
                User: {
                    select: {
                        email: true
                    }
                }
            }
        })

        if (video && video.views === 0) {
            await db.video.update({
                where: {
                    id: videoId
                },
                data: {
                    views: video.views + 1
                }
            })
        }

        if (!video) return
        const { transporter, mailOptions } = await sendEmail(
            video?.User?.email!,
            'You got a viewer',
            `Your video ${video?.title} just received its first viewer`
        )

        transporter.sendMail(
            mailOptions,
            async (error, info) => {
                if (error) {
                    console.log(error.message);
                } else {
                    const notification = await db.user.update({
                        where: {
                            clerkid: user.id
                        },
                        data: {
                            notification: {
                                create: {
                                    content: mailOptions.text
                                }
                            }
                        }
                    })
                    if (notification) {
                        return { status: 200 }
                    }
                }
            }
        )
    } catch (e) {
        console.log(e);
    }
}



export const editVideoInfo = async (
    videoId: string,
    title: string,
    description: string
) => {
    try {
        const video = await db.video.update({
            where: {
                id: videoId
            },
            data: {
                title,
                description
            }
        })

        if (video) {
            return { status: 200, data: 'Video successfully updated' }
        }
        return { status: 404, data: 'Video not found' }
    } catch (e) {
        return { status: 500, data: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' }
    }
}

export const searchFolder = async (query: string) => {
    try {
        const user = await currentUser();
        if (!user) {
            return { status: 404 };
        }

        const folders = await db.folder.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive' 
                },
            },
            select: {
                id: true,
                name: true,
                Workspace: {
                    select: {
                        name: true
                    }
                },
                videos: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (folders && folders.length > 0) {
            const folderData = folders.map(folder => ({
                id: folder.id,
                folderName: folder.name,
                workspaceName: folder.Workspace?.name || 'No Workspace Found',
                videoCount: folder.videos.length
            }));

            return { status: 200, data: folderData };
        }

        return { status: 404, data: undefined };
    } catch (e) {
        return { status: 500, msg: e instanceof Error ? e.message : 'Unknown error', data: undefined };
    }
};


export const searchVideo = async (query: string) => {
    try {
        const user = await currentUser();
        if (!user) {
            return { status: 404 };
        }

        const videos = await db.video.findMany({
            where: {
                title: {
                    contains: query,
                    mode: 'insensitive'
                },
            },
            select: {
                id: true,
                title: true,
                Folder: {
                    select: {
                        name: true
                    }
                },
                Workspace: {
                    select: {
                        name: true
                    }
                },
                User: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                }
            }
        });

        if (videos && videos.length > 0) {
            const videoData = videos.map(video => ({
                id: video.id,
                title: video.title || "No Title Found",
                folderName: video.Folder?.name || "No Folder Found",
                workspaceName: video.Workspace?.name || "No Workspace Found",
                createdBy: video.User ? `${video.User.firstname} ${video.User.lastname}` : 'Unknown User'
            }));

            return { status: 200, data: videoData };
        }

        return { status: 404, data: undefined };
    } catch (e) {
        return { status: 500, msg: e instanceof Error ? e.message : 'Unknown error', data: undefined };
    }
};


export const deleteVideo = async (videoId: string) => {
    try {
        const video = await db.video.delete({
            where: { id: videoId as string },
        })
        return { status: 200, data: 'Video deleted successfully' }
        
    } catch (e) {
        return { status: 500, data: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' }
    }
}


export const deleteFolder = async (folderId: string) => {
    try {
        const folder = await db.folder.delete({
            where: { id: folderId as string },
        })
        return { status: 200, data: 'Folder deleted successfully' }
        
    } catch (e) {
        return { status: 500, data: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' }
    }
}



export const deleteWorkspace = async (workspaceId: string) => {
    try {
        const folder = await db.workspace.delete({
            where: { id: workspaceId as string },
        })
        return { status: 200, data: 'Workspace deleted successfully' }
        
    } catch (e) {
        return { status: 500, data: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' }
    }
}