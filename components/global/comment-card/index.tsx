"use client"

import { CommentForm } from "@/components/forms/comment-form"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CommentRepliesProps } from "@/types/index.type"
import { useState } from "react"

export const CommentCard = ({
    author, videoId, comment, commentId, reply, isReply
}: {
    author: {
        image: string
        firstname: string
        lastname: string
    }
    videoId: string
    comment: string
    commentId?: string
    reply: CommentRepliesProps[]
    isReply?: boolean
}) => {
    const [onReply, setOnReply] = useState<boolean>(false)
    
    return (
        <Card
            className={cn(
                isReply 
                ? 'bg-[#1D1D1D] pl-10 border-none' 
                : 'border-[1px] bg-[#1D1D1D] p-5'
            )}
        >
            <div className="flex gap-x-2 items-center py-2">
                <Avatar className="">
                    <AvatarImage 
                        src={author.image}
                        alt="author"
                    />
                </Avatar>
                <div>
                <p className="capitalize text-sm font-bold text-[#BDBDBD]">
                    {author.firstname} {author.lastname}
                </p>
                <p className="text-[#BDBDBD] text-sm">{comment}</p>
                </div>
            </div>

            {!isReply && (
                <div className="flex justify-end mt-3">
                    {!onReply ? (
                        <Button
                            onClick={() => setOnReply(true)}
                            className="text-sm rounded-full bg-[#252525] text-white hover:text-black"
                        >
                            Reply
                        </Button>
                    ) : (
                        <CommentForm 
                            close={() => setOnReply(false)}
                            author={author.firstname + ' ' + author.lastname}
                            videoId={videoId}
                            commentId={commentId}
                        />
                    )}
                </div>
            )}
            {reply.length > 0 && (
                <div className="flex flex-col gap-y-10 mt-5">
                    {reply.map((reply) => (
                        <CommentCard 
                            isReply
                            reply={[]}  
                            comment={reply.comment}
                            commentId={reply.commentId}
                            videoId={videoId}
                            key={reply.id}
                            author={{
                                image: reply.User?.image!,
                                firstname: reply.User?.firstname!,
                                lastname: reply.User?.lastname!
                            }}
                        />
                    ))}
                </div>
            )}
        </Card>
    )
}