import { useAppSelector } from "@/redux/store"
import { useEffect, useState } from "react"
import { useMutationData } from "./useMutationData"
import { getWorkspaceFolders, moveVideoLocation } from "@/actions/workspace"
import { useZodForm } from "./useZodForm"
import { moveVideoSchema } from "@/components/forms/change-video-location/schema"

export const useMoveVideos = (videoId: string, currentWorkspace: string) => {
        //get state redux
        const { folders } = useAppSelector((state) => state.FolderReducer)
        const { workspaces } = useAppSelector((state) => state.WorkspaceReducer)

        //fetching states
        const [ isFetching, setIsFetching ] = useState(false)
        //state folders
        const [ isFolders, setIsFolders ] = useState< | ({ 
            _count: { 
                videos: number
            }
        } & { 
                id: string,
                name: string,
                createdAt: Date,
                workspaceId: string | null
        })[] | undefined>(undefined)

        
        //use mutation data optimistic
        const { mutate, isPending } = useMutationData(
            ['change-video-location'],
            (data: { folder_id: string; workspace_id: string }) => {
                return moveVideoLocation(videoId, data.workspace_id, data.folder_id);
            }
        )
        

        //usezodforms
        const { errors, onFormSubmit, watch, register } = useZodForm(
            moveVideoSchema,
            mutate,
            { folder_id: null, workspace_id: currentWorkspace }
        )

        //fetchfolders with useEffect
        const fetchFolders = async (workspace: string) => {
            setIsFetching(true)
            const folders = await getWorkspaceFolders(workspace)
            setIsFetching(false)
            setIsFolders(folders.data)
        }
        
        useEffect(() => {
            fetchFolders(currentWorkspace)
        }, [])
        
        useEffect(() => {
            const workspace = watch(async (value) => {
                if (value.workspace_id) fetchFolders(value.workspace_id)
            })
        
            return () => workspace.unsubscribe()
        }, [watch])

        
        return {
            onFormSubmit,
            errors,
            register,
            isPending,
            folders,
            workspaces,
            isFetching,
            isFolders
        }
}