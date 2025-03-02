import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import React from "react"

export const GlobalCard = ({
    children, title, description, footer
}: {
    children?: React.ReactNode
    title: string
    description: string
    footer?: React.ReactNode
}) => {
    return (
        <Card className="bg-transparent mt-4">
            <CardHeader className="p-4">
                <CardTitle className="text-md text-[#9D9D9D]">{title}</CardTitle>
                <CardDescription className="text-[#707070]">{description}</CardDescription>
            </CardHeader>
            {children && <div className="p-4">{children}</div>}
            {footer && <CardFooter className="p-4">{footer}</CardFooter>}
        </Card>
    )
}