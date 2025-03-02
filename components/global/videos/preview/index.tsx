"use client"

import { getPreviewVideo, sendEmailForFirstView } from "@/actions/workspace"
import { useQueryData } from "@/hooks/useQueryData"
import { VideoProps } from "@/types/index.type"
import { useRouter } from "next/navigation"
import { CopyLink } from "../copy-link"
import { RichLink } from "../rich-link"
import { truncateString } from "@/lib/utils"
import { TabMenu } from "../../tabs"
import { AiTools } from "../../ai-tools"
import { VideoTranscript } from "../../video-transcript"
import { Activities } from "../../video-activities"
import { useEffect } from "react"
import { EditVideo } from "../edit"
import { DeleteVideo } from "../delete"

export const VideoPreview = ({
    videoId, workspaceId
}: {
    videoId: string
    workspaceId: string
}) => {
    const router = useRouter()

    const { data } = useQueryData(
        ['preview-video'],
        () => getPreviewVideo(videoId)
    )

    const notifyFirstView = async () => sendEmailForFirstView(videoId)
    
    const { data: video, status, author } = data as VideoProps
    if (status !== 200) router.push('/')

    const daysAgo = Math.floor(
        (new Date().getTime() - video.createdAt.getTime()) / (24 * 60 * 60 * 1000)
    )

    useEffect(() => {
        if (video.views === 0) {
            notifyFirstView()
        }
        return () => {
            notifyFirstView()
        }
    })
    
    return( 
        <div className="grid grid-cols-1 xl:grid-cols-3 p-10 lg:px-20 lg:py-10 overflow-y-auto gap-5">
            <div className="flex flex-col lg:col-span-2 gap-y-10">
                <div>
                    <div className="flex gap-c-5 items-start justify-between">
                        <h2 className="text-white text-4xl font-bold">
                            {video.title}
                        </h2>
                        {author ? (
                            <div>
                                <EditVideo 
                                videoId={videoId}
                                title={video.title as string}
                                description={video.description as string}
                                />   
                                <DeleteVideo videoId={videoId} workspaceId={workspaceId} className="text-[#6c6c6c]"/>
                            </div>
                        ) : (
                            <></>
                        )}
                        
                    </div>
                    <span className="flex gap-x-3 mt-2">
                        <p className="text-[#9D9D9D] capitalize">
                            {video.User?.firstname} {video.User?.lastname}
                        </p>
                        <p className="text-[#707070]">
                            {daysAgo === 0 ? 'Today' : `${daysAgo}d ago `}
                        </p>
                    </span>
                </div>
                <video
                    preload="metadata"
                    className="w-full aspect-video opacity-50  rounded-xl"
                    controls
                >
                    <source 
                        src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#1`}
                    />
                </video>
                <div className="flex flex-col text-2xl gap-y-4">
                    <div className="flex gap-x-5 items-center justify-between">
                        <p className="text-[#BDBDBD] font-semibold">
                            Description
                        </p>
                        {author ? (
                            <EditVideo 
                                videoId={videoId}
                                title={video.title as string}
                                description={video.description as string}
                            />   
                        ) : (
                            <></>
                        )} 
                    </div>
                    <p className="text-[#9D9D9D] text-lg font-medium">
                        {video.description}
                    </p>
                </div>
            </div>
            <div className="lg:col-span-1 flex flex-col gap-y-6">
                <div className="flex justify-end items-center gap-x-3">
                    <CopyLink 
                        variant='outline'
                        className="rounded-full bg-transparent px-10"
                        videoId={videoId}
                    />
                    <RichLink 
                        title={video.title as string}
                        id={videoId}
                        source={video.source}
                        description={truncateString(video.description as string, 150)}
                    />
                </div>
                <div>
                    <TabMenu
                        triggers={["AI Tools", "Transcript", "Activity"]}
                        defaultValue='AI Tools'
                    >
                        <AiTools
                            plan={video.User?.subscription?.plan!}
                            trial={video.User?.trial!}
                            videoId={videoId}
                        />
                        <VideoTranscript transcript={video.summery!} />
                        <Activities  
                            author={video.User?.firstname as string}
                            videoId={videoId}
                        />
                    </TabMenu>
                </div>
            </div>
        </div>
    )
}