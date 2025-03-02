import { FormGenerator } from "@/components/global/form-generator"
import { useEditVideo } from "@/hooks/useEditVideo"

export const EditVideoForm = ({
    videoId, title, description
}: {
    videoId: string
    title: string
    description: string
}) => {
    const { register, onFormSubmit, errors, isPending } = useEditVideo(
        videoId,
        title,
        description
    )
    
    return (
        <form
            className="flex flex-col gap-y-5"
            onSubmit={onFormSubmit}
        >
            <FormGenerator 
                register={register}
                errors={errors}
                name="title"
                inputType="input"
                type="text"
                placeholder="Video Title..."
                label="Title"
            />
            <FormGenerator 
                register={register}
                errors={errors}
                name="description"
                inputType="textarea"
                type="text"
                placeholder="Video Description..."
                label="Description"
            />
        </form>
    )
}