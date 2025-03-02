import { getAllUserVideos, getFolderInfo } from '@/actions/workspace'
import { FolderInfo } from '@/components/global/folders/info'
import { Videos } from '@/components/global/videos'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'

export default async function({
    params
}: {
    params: Promise<{
        folderId: string
        workspaceId: string
    }>
}) {
    const { workspaceId, folderId } = await params;
    const query = new QueryClient()
    await query.prefetchQuery({
        queryKey: ['folder-videos'],
        queryFn: () => getAllUserVideos(folderId)
    })
    
    await query.prefetchQuery({
        queryKey: ['folder-info'],
        queryFn: () => getFolderInfo(folderId)
    })
    
  return (
    <HydrationBoundary state={dehydrate(query)}>
        <FolderInfo folderId={folderId} />
        <Videos
            folderId={folderId}
            videosKey={'folder-videos'}
            workspaceId={workspaceId}
        />
    </HydrationBoundary>
  )
}
