import { Button } from "@/components/ui/button"
import { Link } from "lucide-react"
import { toast } from "sonner"

export const CopyLink = ({
    className, videoId, variant
}: {
    className?: string
    videoId: string
    variant?: | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null
}) => {
    const onCopyClipboard = () => {
        navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_HOST_URL}/preview/${videoId}`
        )
        return (
            toast (
                'Copied', {
                    description: 'Link copied successfully'
                }
            )
        )
    }
    
    return (
        <Button
            variant={variant}
            onClick={onCopyClipboard}
            className={className}
        >
            <Link 
                size={20}
                className="text-[#a4a4a4]"
            />
        </Button>
    )
}