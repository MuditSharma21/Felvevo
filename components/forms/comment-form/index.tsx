"use client"

import { FormGenerator } from "@/components/global/form-generator"
import Loader from "@/components/global/loader/loader"
import { Button } from "@/components/ui/button"
import { useVideoComment } from "@/hooks/useVideoComment"
import { Send, X } from "lucide-react"

export const CommentForm = ({
    author, videoId, commentId, close
}: {
    author: string
    videoId: string
    commentId?: string
    close?: () => void
}) =>{
    const { register, onFormSubmit, errors, isPending } = useVideoComment(videoId, commentId)
    
    return (
        <form className="relative w-full" onSubmit={onFormSubmit}>
            <FormGenerator 
                register={register}
                errors={errors}
                placeholder={`Respond to ${author}...`}
                name="comment"
                inputType="input"
                lines={8}
                type="text"
            />
            <Button className="p-0 bg-transparent absolute top-[1px] right-3 hover:bg-transparent">
                <Loader state={isPending}>
                    <Send 
                        className="text-white/50 cursor-pointer hover:text-white/80"
                        size={18}
                    />
                </Loader>
            </Button>
        </form>
    )
}