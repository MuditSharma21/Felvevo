import { EditVideoForm } from "@/components/forms/edit-video"
import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

export const EditVideo = ({
    videoId, title, description
}: {
    videoId: string
    title: string
    description: string
}) => {
    return (
        <Modal
            title="Edit video details"
            description="You can update your video details here"
            trigger={
                <Button
                    variant={'ghost'}
                >
                    <Edit className="text-[#6c6c6c]"/>
                </Button>
            }
        >
            <EditVideoForm
                videoId={videoId}
                title={title}
                description={description}
            />
        </Modal>
    )
}