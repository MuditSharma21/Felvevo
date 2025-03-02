import { getUserProfile, getVideoComments } from "@/actions/user"
import { getPreviewVideo } from "@/actions/workspace"
import { VideoPreview } from "@/components/global/videos/preview"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

export default async function({
    params
}: {
    params: Promise<{
        videoId: string
        workspaceId: string
    }>
}) {
    const { videoId, workspaceId } = await params;
    const query = new QueryClient()

    await query.prefetchQuery({
        queryKey: ['preview-video'],
        queryFn: () => getPreviewVideo(videoId)
    })

    await query.prefetchQuery({
        queryKey: ['user-profile'],
        queryFn: getUserProfile
    })    

    await query.prefetchQuery({
        queryKey: ['video-comments'],
        queryFn: () => getVideoComments(videoId)
    })    

    return (
        <HydrationBoundary state={dehydrate(query)}>
            <VideoPreview videoId={videoId} workspaceId={workspaceId}/>
        </HydrationBoundary>
    )
}