import { deleteFolder, deleteWorkspace } from "@/actions/workspace"
import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export const DeleteWorkspace = ({
    workspaceId, className
} : {
    workspaceId: string
    className?:string
}) => {
    const router = useRouter()
    const handleDelete = async () => {
        const isSuccess = await deleteWorkspace(workspaceId)
        if (isSuccess) {
            // Redirect to another page upon success
            router.push(`/dashboard`) // Change this to the page you want
        } else {
            // Handle failure (optional)
            console.error("Deletion failed")
        }
    }
    
    return (
        <Modal 
        title="Delete Workspace"
        description="Do you want to delete this workspace?"
        trigger={
            <Button variant={'ghost'} className={className} onClick={(e) => e.stopPropagation()}>
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