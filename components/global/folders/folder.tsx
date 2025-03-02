"use client"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import Loader from "../loader/loader"
import React, { useRef, useState } from "react"
import { useMutationData, useMutationDataState } from "@/hooks/useMutationData"
import { renameFolders } from "@/actions/workspace"
import { Input } from "@/components/ui/input"
import { DeleteFolder } from "../delete-folder"

export const Folder = ({
    name, id, optimistic, count, workspaceId
}: {
    name: string
    id: string
    optimistic?: boolean
    count?: number
    workspaceId: string
}) => {
    const pathname = usePathname()
    const router = useRouter()
    const [onRename, setOnRename] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const folderCardRef = useRef<HTMLDivElement | null>(null)
     
    const {mutate, isPending} = useMutationData(
        ['rename-folders'],
        (data: { name: string }) => renameFolders(id, data.name),
        'workspace-folders',
        () => {
            setOnRename(false)
        }
    )

    const  { latestVariables } = useMutationDataState(['rename-folders'])

    const handleFolderOnClick = () => {
        router.push(`${pathname}/folder/${id}`)
    }
    
    const handleNameOnDoubleClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
        e.stopPropagation()
        setOnRename(true)
    }

    const updateFolderName = (e: React.FocusEvent<HTMLInputElement>) => {
        if (inputRef.current) {
            if (inputRef.current.value) {
                mutate({ name: inputRef.current.value, id })
            } else {
                setOnRename(false)
            }
        }
    }

  return (
    <div 
        className={cn(optimistic && 'opacity-60',"flex hover:bg-neutral-800 cursor-pointer transition duration-150 items-center gap-2 justify-between min-w-[250px] py-4 px-4 rounded-lg  border-[1px]")}
        onClick={handleFolderOnClick}
        ref={folderCardRef}
    >
        <Loader state={isPending}>
            <div className="flex flex-col gap-[1px]">
                {onRename ? <Input 
                    placeholder={name}
                    className="border-none text-base w-full outline-none text-neutral-300 bg-transparent p-0"
                    ref={inputRef}
                    autoFocus
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => updateFolderName(e)}
                /> : (
                    <p 
                        className="text-neutral-300"
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={handleNameOnDoubleClick}
                    >
                        {latestVariables && latestVariables.status === "pending" && latestVariables.variables.id === id ? latestVariables.variables.name : name}
                    </p>
                )}
                <span className="text-sm text-neutral-500">{count || 0} videos</span>
            </div>
        </Loader>
        <div className="flex items-center z-50">
            {/* <FolderDuotone/>  */}
            <DeleteFolder folderId={id} workspaceId={workspaceId} className="text-[#6c6c6c]"/>
        </div>
    </div>

  )
}

