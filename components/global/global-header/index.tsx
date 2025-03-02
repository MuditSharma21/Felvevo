"use client"

import { Workspace } from '@prisma/client'
import { usePathname } from 'next/navigation'
import { DeleteWorkspace } from '../delete-workspace'

export const GlobalHeader = ({
    workspace,
    workspaceId
}: {
    workspace: Workspace
    workspaceId: string
}) => {
    const pathname = usePathname().split(`/dashboard/${workspace.id}`)[1]
    return(
        <article className='flex flex-col gap-2'>
            <span className='text-[#707070] text-xs'>
                {pathname.includes('video') ? '' : workspace.type.toLocaleUpperCase()}
            </span>
            <div className='flex items-center gap-1'>
                <h1 className='text-4xl font-bold'>
                    {pathname && !pathname.includes('folder') && !pathname.includes('video') ? pathname.charAt(1).toUpperCase() + pathname.slice(2).toLowerCase()
                    : pathname.includes('video')
                    ? ''
                    : 'My Library'}
                </h1>
                {workspace.type === 'PUBLIC' ? (
                    <DeleteWorkspace workspaceId={workspaceId} />
                ) : ''}
            </div>
        </article>
    )
}