import { getUserNotifications, onAuthenticateUser } from "@/actions/user";
import { getUserWorkspaces, verifyAccessToWorkspace } from "@/actions/workspace";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Sidebar } from "@/components/global/sidebar";
import { GlobalHeader } from "@/components/global/global-header";

export default async function ({
    children, params
}: {
    children: React.ReactNode;
    params: { workspaceId: string }
}) {
    const { workspaceId } = await params;
    const auth = await onAuthenticateUser()
    if (!auth.user?.workspace) redirect('/auth/signin')
    if (!auth.user.workspace.length) redirect('/auth/signin')
        const hasAcccess = await verifyAccessToWorkspace(workspaceId)

    if (hasAcccess.status !== 200) {
        redirect(`/dashboard/${auth.user?.workspace[0].id}`)
    }

    if (!hasAcccess.data?.workspace) return null

    const query = new QueryClient()

    await query.prefetchQuery({
        queryKey: ["user-workspaces"],
        queryFn: () => getUserWorkspaces()
    })
    await query.prefetchQuery({
        queryKey: ["user-notifications"],
        queryFn: () => getUserNotifications()
    })

    

    return (
        <HydrationBoundary state={dehydrate(query)}>
            <div className="flex h-screen w-screen">
                <Sidebar activeWorkspaceId={workspaceId}/>
                <div className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden">
                    <GlobalHeader workspace={hasAcccess.data.workspace} workspaceId={workspaceId}/>
                    <div className="mt-4">{children}</div>
                </div>
            </div>
        </HydrationBoundary>
    )
}
