"use client"

import FolderDuotone from "@/components/icons/folder-duotone"
import { cn } from "@/lib/utils"
import { Folder } from "./folder"
import { useQueryData } from "@/hooks/useQueryData"
import { getWorkspaceFolders } from "@/actions/workspace"
import { useMutationDataState } from "@/hooks/useMutationData"
import { useDispatch } from "react-redux"
import { FOLDERS } from "@/redux/slices/folder"
import { Videos } from "../videos"
import { useEffect } from "react"

export type FoldersProps = {
    status: number,
    data: ({
        _count: {
            videos: number
        }
    } & {
        id: string
        name: string
        createdAt: Date
        workspaceId: string | null
    })[]
}

export const Folders = ({
    workspaceId
}: {
    workspaceId: string
}) => {
        
    const dispatch = useDispatch()
    //get folders
    const { data, isFetched } = useQueryData(
        ['workspace-folders'],
        () => getWorkspaceFolders(workspaceId)
        
    )
    
    const { latestVariables } = useMutationDataState(['create-folder'])    

    const { data: folders, status } = data as FoldersProps

    useEffect(() => {
        if (isFetched && folders) {
            dispatch(FOLDERS({ folders: folders }))
        }
    }, [isFetched, folders, dispatch])
    // WIP: Add redux stuff for folders
    //optimistic variable = add new data that was created 

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <FolderDuotone />
                    <h2 className="text-[#BDBDBD] text-xl">Folders</h2>
                </div>
            </div>
            <section className={cn(status !== 200 && 'justify-center','flex items-center gap-4 overflow-x-auto w-full')}>
                {status !== 200 ? ( <p className="text-neutral-300">
                    No folders
                </p> ) : (
                    <>{latestVariables && latestVariables.status === 'pending' && (
                        <Folder 
                            name={latestVariables.variables.name}
                            id={latestVariables.variables.id}
                            workspaceId={workspaceId}
                            optimistic
                        />
                    )}
                        {folders.map((folder) => (
                            <Folder 
                                name={folder.name}
                                count={folder._count.videos}
                                id={folder.id}
                                key={folder.id}
                                workspaceId={workspaceId}
                            />
                        ))}
                    </>
                )}
            </section>
            <Videos
            workspaceId={workspaceId}
            folderId={workspaceId}
            videosKey="user-videos"
            />
        </div>
    )
}