import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

export const Modal = ({
    children, trigger, title, description, className
}: {
    children: React.ReactNode
    trigger: React.ReactNode
    title: string
    description: string
    className?: string
}) => {
    return (
        <Dialog>
            <DialogTrigger className={className} asChild>
                {trigger}
            </DialogTrigger> 
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}