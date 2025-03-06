"use client"

import { getUserWorkspaces } from "@/actions/workspace"
import { Modal } from "@/components/modal"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useQueryData } from "@/hooks/useQueryData"
import { WorkspaceProps } from "@/types/index.type"
import { Menu, PlusCircle } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { UserSearch } from "../search-user"
import { MENU_ITEMS } from "@/constants"
import { SideBarItem } from "./sidebar-item"
import { getUserNotifications } from "@/actions/user"
import { NotificationProps } from "@/types/index.type"
import { WorkspacePlaceholder } from "./workspace-placeholder"
import { GlobalCard } from "../global-card"
import { Button } from "@/components/ui/button"
import Loader from "../loader/loader"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { InfoBar } from "../infobar"
import { useDispatch } from "react-redux"
import { WORKSPACES } from "@/redux/slices/workspaces"
import { useEffect } from "react"

export const Sidebar = ({
    activeWorkspaceId
}: {
    activeWorkspaceId: string
}) => {
    // WIP: Add the upgrade button and payment gateway
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useDispatch ()
    
    const {data, isFetched} = useQueryData(["user-workspaces"], getUserWorkspaces)
    const menuItems = MENU_ITEMS(activeWorkspaceId)

    const { data: notifications } =useQueryData(
        ['user-notifications'],
        getUserNotifications
    )

    const { data: workspace } = data as WorkspaceProps
    const { data: count } = notifications as NotificationProps
    
    const onChangeActiveWorkspace = (value: string) => {
        router.push(`/dashboard/${value}`)
    }

    const currentWorkspace = workspace?.workspace?.find((s) => s?.id == activeWorkspaceId)

    useEffect(() => {
        if (isFetched && workspace) {
            dispatch(WORKSPACES({ workspaces: workspace.workspace }))
        }
    }, [isFetched, workspace, dispatch])
    
    const SidebarSection = (
        <div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden z-50">
            <div className="bg-[#111111] p-4 flex gap-2 justify-center items-center absolute top-2 left-0 right-4">
                <Image 
                    alt="logo"
                    src={'/logo.png'}
                    height={40}
                    width={40}
                />
                <p className="text-2xl">Felvevő</p>
            </div>
            <Select defaultValue={activeWorkspaceId} onValueChange={onChangeActiveWorkspace}>
                <SelectTrigger className="mt-16 text-neutral-400 bg-transparent">
                    <SelectValue placeholder='Select a workspace'></SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#111111] backdrop-blur-xl">
                    <SelectGroup>
                        <SelectLabel>
                            Workspaces
                        </SelectLabel>
                        <Separator />
                        {workspace.workspace.map((workspace) => (
                                <SelectItem
                                    key={workspace.id}
                                    value={workspace.id}
                                >
                                {workspace.name}
                                </SelectItem>
                        ))}
                        {workspace?.members?.length > 0 && workspace.members.map(
                            (workspace) => workspace.Workspace && <SelectItem key={workspace.Workspace.id} value={workspace.Workspace.id}>
                                {workspace.Workspace.name}
                            </SelectItem>
                        )}
                    </SelectGroup>
                </SelectContent>
            </Select>
            {currentWorkspace?.type === 'PUBLIC' && workspace.subscription?.plan == 'PREMIUM' && (
                <Modal
                trigger={<span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90 hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
                    <PlusCircle size={15} className="text-neutral-800/90 fill-neutral-500"/>
                    <span className="text-neutral-400 font-semibold text-xs">
                        Invite To Workspace
                    </span>
                </span>}
                title="Invite To Workspace"
                description="Invite other user to your workspace"
            >
                <UserSearch workspaceId={activeWorkspaceId} />
            </Modal> 
        )}
        <p className="w-full text-[#9D9D9D] font-bold mt-4">Menu</p>
        <nav className="w-full">
            <ul>{menuItems.map((item) => (
                <SideBarItem
                    href={item.href}
                    icon={item.icon}
                    selected={pathname === item.href}
                    title={item.title}
                    key={item.title}
                    notifications={
                        (item.title === 'Notifications' && 
                            count._count &&
                            count._count.notification
                        ) || 
                        0
                    }
                />
            ))}</ul>
        </nav>
        <Separator className="w-4/5"/>
        <p className="w-full text-[#9D9D9D] font-bold mt-4">Workspaces</p>
        {
            workspace.workspace.length === 1 && workspace.members.length === 0 && <div className="w-full mt-[-10px]">
                <p className="text-[#3c3c3c] font-medium text-sm">
                    {workspace.subscription?.plan === 'FREE' ? 'Upgrade to create workspaces' : 'No workspaces'}   
                </p>
            </div>
        }
        <nav className="w-full">
            <ul className="h-[150px] overflow-auto overflow-x-hidden fade-layer">
                {workspace?.workspace?.length > 0 && workspace.workspace.map((item) => 
                item.type !== 'PERSONAL' && (
                    <SideBarItem 
                        href={`/dashboard/${item.id}`}
                        selected={pathname === `/dashboard/${item.id}`}
                        title={item.name}
                        notifications={0}
                    key={item.name}
                        icon={<WorkspacePlaceholder>
                            {item.name.charAt(0)}
                        </WorkspacePlaceholder>}
                    />))}
                {
                    workspace?.members?.length > 0 && workspace.members.map((item) => {
                        if (!item || !item.Workspace) return null
                        return (<SideBarItem 
                            href={`/dashboard/${item.Workspace.id}`}
                            selected={pathname === `/dashboard/${item.Workspace.id}`}
                            title={item.Workspace.name}
                            notifications={0}
                            key={item.Workspace.name}
                            icon={<WorkspacePlaceholder>
                                {item.Workspace.name.charAt(0)}
                            </WorkspacePlaceholder>}
                        />)
                    })
                }
            </ul>
        </nav>
        <Separator className="w-4/5"/>
        {workspace.subscription?.plan === 'FREE' && <GlobalCard
            title="Upgrade ro premium"
            description="Unlock AI features like transcripiton, AI summary, and more."
        >
            <Button className="text-sm w-full">
                <Loader state={false}>Upgrade</Loader>
            </Button>
        </GlobalCard>}
        </div>
    )
    return (
        <div>
            <InfoBar activeWorkspaceId={activeWorkspaceId}/>
            <div className="md:hidden fixed my-4 z-50">
                <Sheet>
                    <SheetTrigger
                        className="ml-2"
                        asChild
                    >
                        <Button
                            className="mt-[2px]"
                            variant={"ghost"}
                        >
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={'left'} className="p-0 w-fit h-full">
                        {SidebarSection}
                        <SheetTitle>Menu</SheetTitle>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="md:block hidden h-full">
                {SidebarSection}
            </div>
        </div>
    )
}