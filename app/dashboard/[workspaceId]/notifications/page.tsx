"use client"

import { getUserNotifications } from "@/actions/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQueryData } from "@/hooks/useQueryData";
import { User } from "lucide-react";

export default function() {
    const { data: notifications } = useQueryData(
        ['user-notifications'],
        getUserNotifications
    )

    const { data: notification, status } = notifications as {
        status: number
        data: {
            notification: {
                id: string
                userId: string | null
                content: string
            }[]
        }
    }
    
    if (status !== 200) {
        return (
            <div className="flex justify-center items-center h-full w-full">
                <p>No Notifications</p>
            </div>
        )
    }

    
    return (
        <div className="flex flex-col">
            {notification.notification.map((n) => (
                <div
                    key={n.id}
                    className="border-2 flex gap-x-3 items-center rounded-lg p-3"
                >
                    <Avatar>
                        <AvatarFallback>
                            <User />
                        </AvatarFallback>
                    </Avatar>
                    <p>{n.content}</p>
                </div>
            ))}
        </div>
    )
}