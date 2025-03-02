import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json()
        const { id } = params

        const personalWorkspaceId = await db.user.findUnique({
            where: {
                id
            },
            select: {
                workspace: {
                    where: {
                        type: 'PERSONAL'
                    },
                    select: {
                        id: true
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        })

        const startProcessingVideo = await db.workspace.update({
            where: {
                id: personalWorkspaceId?.workspace[0].id
            },
            data: {
                videos: {
                    create: {
                        source: body.filename,
                        userId: id
                    }
                }
            },
            select: {
                User: {
                    select: {
                        subscription: {
                            select: {
                                plan: true
                            }
                        }
                    }
                }
            }
        })

        if (startProcessingVideo) {
            return NextResponse.json({
                status: 200,
                plan: startProcessingVideo.User?.subscription?.plan
            })
        }
        return NextResponse.json({ status: 400 })
    } catch (e) {
        console.log('Error while processing video', e)
    }
}