
import Loader from "../loader/loader"
import { CardMenu } from "./card-menu"
import { CopyLink } from "./copy-link"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dot, Share2, User } from "lucide-react"
import { DeleteVideo } from "./delete"

type VideoCardProps = {
    User: {
        firstname: string | null
        lastname: string | null
        image: string | null
    } | null
    id: string
    processing: boolean
    Folder: {
        id: string
        name: string
    } | null
    createdAt: Date
    title: string | null
    source: string
    workspaceId: string
}

export const VideoCard = (
    props: VideoCardProps
) => {
    const daysAgo = Math.floor(
        (new Date().getTime() - props.createdAt.getTime()) / (24 * 60 * 60 * 1000)
    )

    return (
        <Loader 
            state={props.processing}
            className="bg-[#171717] flex justify-center items-center border-[1px] border-[#252525] rounded-xl"
        >
            <div className="overflow-hidden cursor-pointer bg-[#171717] relative border-[1px] border-[#252525] flex flex-col rounded-xl">
                <div className="absolute top-3 right-3 z-40 flex flex-col gap-y-3">
                    <CardMenu
                        videoId={props.id}
                        currentWorkspace={props.workspaceId}
                        currenntFolder={props.Folder?.id}
                        currentFolderName={props.Folder?.name}
                    />
                    <CopyLink 
                        className="p-0 h-5 hover:bg-transparent"
                        videoId={props.id}
                        variant='ghost'
                    />
                    <DeleteVideo videoId={props.id} workspaceId={props.workspaceId} className="p-0 h-5 hover:bg-transparent text-[#a4a4a4]"/>
                </div>
                <Link
                    href={`/dashboard/${props.workspaceId}/video/${props.id}`}
                    className="hover:bg-[#252525] transition duration-150 flex flex-col justify-between h-full"
                >
                    <video
                        controls={false}
                        preload="metadata"
                        className="w-full aspect-video opacity-50 z-20"
                    >
                        <source 
                            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${props.source}#t=1`}
                        />
                    </video>
                    <div className="px-5 py-3 flex flex-col gap-y-2 z-20">
                        <h2 className="text-sm font-semibold text-[#BDBDBD]">
                            {props.title}
                        </h2>
                        <div className="flex gap-x-2 items-center mt-1.5">
                            <Avatar className="w-7 h-7">
                                <AvatarImage src={props.User?.image as string} />
                                    <AvatarFallback>
                                        <User />
                                    </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="capitalize text-[#BDBDBD] text-sm">
                                    {props.User?.firstname} {props.User?.lastname} 
                                </p>
                                <p className="text-[#6a6969] text-xs">
                                    {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                                </p>
                            </div>
                        </div>
                        <div className="mt-1.5">
                            <span className="flex gap-x-1 items-center">
                                <Share2 
                                    size={12}
                                    fill="#9D9D9D"
                                    className="text-[#9D9D9D]"
                                />
                                <p className="text-xs text-[#9D9D9D] capitalize">
                                    {props.User?.firstname}'s Workspace
                                </p>
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        </Loader>
    )
}