import { FormGenerator } from "@/components/global/form-generator"
import Loader from "@/components/global/loader/loader"
import { Button } from "@/components/ui/button"
import { useCreateWorkspace } from "@/hooks/useCreateWorkspace"

export const WorkspaceForm = () => {
    const { errors, onFormSubmit, register, isPending } = useCreateWorkspace()
    
    return (
        <form
            onSubmit={onFormSubmit}
            className="flex flex-col gap-y-3"
        >
            <FormGenerator 
                register={register}
                name="name"
                placeholder="Workspace Name"
                label="Workspace Name"
                errors={errors}
                inputType="input"
                type="text"
            />
            <Button 
                className="text-sm w-full mt-2"
                type="submit"
                disabled={isPending}
            >
                <Loader state={isPending}>Create Workspace</Loader>
            </Button>
        </form>
    )
}