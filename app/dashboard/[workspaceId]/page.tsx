import { getAllUserVideos, getWorkspaceFolders } from "@/actions/workspace"
import { CreateFolders } from "@/components/global/create-folders"
import { CreateWorkspace } from "@/components/global/create-workspace"
import { Folders } from "@/components/global/folders"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

export default async function({
    params
}: {
    params: Promise<{
        workspaceId: string
    }>
}) {
    const { workspaceId } = await params;
    const query = new QueryClient()

  await query.prefetchQuery({
    queryKey: ['workspace-folders'],
    queryFn: () => getWorkspaceFolders(workspaceId),
  })

  await query.prefetchQuery({
    queryKey: ['user-videos'],
    queryFn: () => getAllUserVideos(workspaceId),
  })
    return (
        <HydrationBoundary state={dehydrate(query)}>
            <div>
                <div className="flex w-full justify-between md:justify-end md:gap-2">
                        <CreateWorkspace />
                        <CreateFolders workspaceId={workspaceId}/>
                </div>
                <section className="py-9">
                        <Folders workspaceId={workspaceId}/>
                </section>
        </div>
        </HydrationBoundary>
    )
}