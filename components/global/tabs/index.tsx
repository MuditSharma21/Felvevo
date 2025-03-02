import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from "react"

export const TabMenu = ({
    children, triggers, defaultValue
}: {
    children: React.ReactNode
    triggers: string[]
    defaultValue: string
}) => {
    return (
        <Tabs
            className="w-full"
            defaultValue={defaultValue}
        >
            <TabsList className="flex justify-start bg-transparent">
                {triggers.map((trigger) => (
                    <TabsTrigger 
                        key={trigger}
                        value={trigger}
                        className="capitalize text-base data-[state=active]:bg-[#1D1D1D]"
                    >
                        {trigger}
                    </TabsTrigger>
                ))}
            </TabsList>
            {children}
        </Tabs>
    )
}