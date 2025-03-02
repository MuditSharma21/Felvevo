import { getAllUserVideos, getWorkspaceFolders } from "@/actions/workspace"
import { CreateFolders } from "@/components/global/create-folders"
import { CreateWorkspace } from "@/components/global/create-workspace"
import { Folders } from "@/components/global/folders"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
            <Tabs
                defaultValue="videos"
                className="mt-6"
            >
                <div className="flex w-full justify-between items-center">
                    <TabsList className="bg-transparent gap-2 pl-0">
                        <TabsTrigger
                            className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
                            value="videos"
                        >
                            Videos
                        </TabsTrigger>
                        |
                        <TabsTrigger
                            className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
                            value="archive"
                        >
                            Archive
                            {/* Todo */}
                        </TabsTrigger>
                    </TabsList>
                    <div className="flex gap-x-3">
                        <CreateWorkspace />
                        <CreateFolders workspaceId={workspaceId}/>
                    </div>
                </div>
                <section className="py-9">
                    <TabsContent value="videos">
                        <Folders workspaceId={workspaceId}/>
                    </TabsContent>
                </section>
            </Tabs>
        </div>
        </HydrationBoundary>
    )
}