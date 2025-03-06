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
            title="Move Video"
            description="Move this video to a new Workspace/Folder"
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