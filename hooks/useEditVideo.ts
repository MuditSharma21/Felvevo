import { editVideoSchema } from "@/components/forms/edit-video/schema"
import { useZodForm } from "./useZodForm"
import { useMutationData } from "./useMutationData"
import { editVideoInfo } from "@/actions/workspace"

export const useEditVideo = (
    videoId: string,
    title: string,
    description: string
) => {
    const { mutate,isPending } = useMutationData(
        ['edit-video'],
        (data: {
            title: string
            description: string
        }) => editVideoInfo(videoId, data.title, data.description),
        'preview-video'
    )
    const { register, onFormSubmit, errors } = useZodForm(
        editVideoSchema,
        mutate,
        {
            title,
            description
        }
    )

    return { register, onFormSubmit, errors, isPending }
}