"use client"

import { CommentForm } from "@/components/forms/comment-form"
import { TabsContent } from "@/components/ui/tabs"
import { CommentCard } from "../comment-card"
import { useQueryData } from "@/hooks/useQueryData"
import { getVideoComments } from "@/actions/user"
import { VideoCommentProps } from "@/types/index.type"

export const Activities = ({
    author, videoId
}: {
    author: string
    videoId: string
}) => {
    const { data } = useQueryData(
        ['video-comments'],
        () => getVideoComments(videoId)
    )

    const { data: comments } = data as VideoCommentProps
    
    return (
        <TabsContent
            value="Activity"
            className="p-5 rounded-xl flex flex-col gap-y-5"
        >
            <CommentForm
                author={author}
                videoId={videoId}
            />
            {comments?.map((comment) => (
                <CommentCard
                comment={comment.comment}
                key={comment.id}
                author={{
                    image: comment.User?.image!,
                    firstname: comment.User?.firstname!,
                    lastname: comment.User?.lastname!
                }}
                videoId={videoId}
                reply={comment.reply}
                commentId={comment.id}
                />
            ))}
        </TabsContent>
    )
}