import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params } : { params: { id: string } }
) {
    try {
        console.log('CALLED');
        const body = await req.json()
        const { id } = await params

        const studio = await db.user.update({
            where: {
                id
            },
            data: {
                studio: {
                    update: {
                        screen: body.screen,
                        mic: body.mic,
                        preset: body.preset
                    }
                }
            }
        })

        if (studio) {
            return NextResponse.json({ status: 200, message: 'Studio Updated!' })
        }    
        return NextResponse.json({ status: 400, message: 'Oops! Something went wrong' })
    } catch (e) {
        console.log('Error while updating studio', e)
    }
}