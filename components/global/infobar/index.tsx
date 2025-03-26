
import VideoRecorderIcon from "@/components/icons/video-recorder"
import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { Search, UploadIcon } from "lucide-react"
import { ItemSearch } from "../search-items"
import { VideoUpload } from "../video-upload"
import { RecordVideo } from "../record-video"

export const InfoBar = ({
    activeWorkspaceId, folderId
}: {
    activeWorkspaceId: string
    folderId?: string
}) => {
    
    return (
        <div className="pl-20 md:pl-[265px] fixed p-4 w-full flex items-center justify-between gap-4 backdrop-filter backdrop-blur-sm bg-[rgba(17,17,17,0.5)] border-b z-50">
            <div className="flex gap-4 justify-center items-center border-2 rounded-full px-2 sm:px-4 p-2 sm:p-0 w-full max-w-lg">
                <Search
                    size={25}
                    className="text-[#707070]"
                />
                <Modal
                    trigger={
                        <span className="text-sm cursor-pointer w-full rounded-sm sm:p-[10px] gap-2 flex">
                            <span className="text-neutral-400 flex items-center font-semibold text-xs ">
                            <span className="sm:inline hidden">Search for folders or videos...</span>
                            <span className="sm:hidden">Search...</span>
                            </span> 
                        </span>
                    }
                    title="Search"
                    description=""
                >
                    <div className="h-96">
                    <ItemSearch workspaceId={activeWorkspaceId}/>
                    </div>
                </Modal>
            </div>
            <div className="flex items-center gap-4">
                    <Modal
                        title="Upload Video"
                        description="Click to upload or drag and drop below"
                        trigger={
                            <Button className="bg-[#9D9D9D] flex items-center gap-2">
                                <UploadIcon size={20}/>
                                <span className="sm:flex hidden items-center gap-2">Upload</span>
                            </Button>
                        }
                    >
                        <VideoUpload workspaceId={activeWorkspaceId} folderId={folderId}/>
                    </Modal>
                <Modal
                    title=""
                    description=""
                    trigger={<Button 
                        className="bg-[#9D9D9D] flex items-center gap-2"
                    >
                        <VideoRecorderIcon />
                        <span className="sm:flex hidden items-center gap-2">Record</span>
                    </Button>}
                >
                    <RecordVideo />
                </Modal>
                {/* TODO: Implement Record functionality */}
                <UserButton />
            </div>
        </div>
    )
}
 




// TODO: Landing page 