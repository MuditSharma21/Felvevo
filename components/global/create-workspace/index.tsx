"use client"

import { getUserWorkspaces } from "@/actions/workspace"
import { WorkspaceForm } from "@/components/forms/workspace-form"
import FolderPlusDuotone from "@/components/icons/folder-plus-duotone"
import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { useQueryData } from "@/hooks/useQueryData"

export const CreateWorkspace = () => {
    const { data } = useQueryData(['user-workspaces'], getUserWorkspaces)
    
    const {data: plan} = data as {
        status: number
        data :{
            subscription: {
                plan: 'PREMIUM' | 'FREE'
            }
        }
    }

    if (plan.subscription?.plan === 'FREE') {
        return <></>
    }

    if (plan.subscription?.plan === 'PREMIUM') {
        return (
            <Modal
                title="Create a workspace"
                description="Workspaces help you collaborate with team members. You are assigned a default personal workspace where you can share videos in private with yourself."
                trigger={<Button className="bg-[#1D1D1D] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl">
                    <FolderPlusDuotone />
                    Create workspace
                </Button>}
            >
                <WorkspaceForm />
            </Modal>
        )
    }
}