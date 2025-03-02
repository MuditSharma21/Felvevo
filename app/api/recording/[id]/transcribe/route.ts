import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    //WIP: Wire up ai agent
    try {
        const body = await req.json()
        const { id } = params

        const content = JSON.parse(body.content)
        
        const transcribed = await db.video.update({
            where: {
                userId: id,
                source: body.filename
            },
            data: {
                title: content.title,
                description: content.summary,
                summery: content.transcript
            }
        })

        if (transcribed) {
            console.log('✅ Transcribed')
            return NextResponse.json({ status: 200 })
        }
        return NextResponse.json({ status: 400 })
    } catch (e) {
        console.log('Error while transcribing', e)
    }
}