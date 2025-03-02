import { deleteVideo } from "@/actions/workspace"
import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export const DeleteVideo = ({
    videoId, workspaceId, className
} : {
    videoId: string
    workspaceId: string
    className?:string
}) => {
    const router = useRouter()
    const handleDelete = async () => {
        const isSuccess = await deleteVideo(videoId)
        if (isSuccess) {
            // Redirect to another page upon success
            router.push(`/dashboard/${workspaceId}`) // Change this to the page you want
        } else {
            // Handle failure (optional)
            console.error("Deletion failed")
        }
    }
    
    return (
        <Modal 
        title="Delete Video"
        description="Do you want to delete this video?"
        trigger={
            <Button variant={'ghost'} className={className}>
                <Trash2 className={className}/>
            </Button>
        }
    >
        <div>
            
            <Button onClick={handleDelete}>Yes</Button>
        </div>   
    </Modal>
    )
} 