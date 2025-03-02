"use client"

import FolderPlusDuotone from "@/components/icons/folder-plus-duotone"
import { Button } from "@/components/ui/button"
import { useCreateFolders } from "@/hooks/useCreateFolders"

export const CreateFolders = ({
    workspaceId
}: {
    workspaceId: string
}) => {
    const {onCreateNewFolder} = useCreateFolders(workspaceId)
        
    return (
        <Button 
            onClick={onCreateNewFolder}
            className="bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl"
        >
            <FolderPlusDuotone />
            Create a folder
        </Button>
    )
}