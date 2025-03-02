import { ChangeVideoLocation } from "@/components/forms/change-video-location"
import { Modal } from "@/components/modal"
import { Move } from "lucide-react"

export const CardMenu = ({
    videoId,
    currentWorkspace,
    currenntFolder,
    currentFolderName
}: {
    videoId: string
    currentWorkspace?: string
    currenntFolder?: string
    currentFolderName?: string
}) => {
    return (
        <Modal 
            className="flex items-center cursor-pointer gap-x-2"
            title="Move to new Workspace/Folder"
            description="This action cannot be undone. This will permanently delete your account and remove your data form our servers."
            trigger={
                <Move 
                    size={20}
                    fill="a4a4a4"
                    className="text-[#a4a4a4]"
                />
            }
        >
            <ChangeVideoLocation 
                videoId={videoId}
                currentWorkspace={currentWorkspace}
                currentFolder={currenntFolder}
                currentFolderName={currentFolderName}
            />
        </Modal>
    )
}