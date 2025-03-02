"use server"

import { db } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import nodemailer from 'nodemailer'
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { nanoid } from "nanoid";

export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    html?: string
) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAILER_EMAIL,
            pass: process.env.MAILER_PASSWORD
        },
    })

    const mailOptions = {
        to,
        subject,
        text,
        html
    }

    return { transporter, mailOptions }
}



export const onAuthenticateUser = async () => {
    try {
        const user = await currentUser()

        if (!user) {
            return { status: 401, msg: 'User not authenticated' }
        }

        if (!user.emailAddresses || user.emailAddresses.length === 0) {
            return { status: 400, data: 'User does not have a valid email address' }
        }

        const userData = {
            clerkid: user.id,
            email: user.emailAddresses[0].emailAddress,
            firstname: user.firstName,
            lastname: user.lastName,
            image: user.imageUrl,
        }

        const userExist = await db.user.upsert({
            where: { 
                clerkid: user.id
            },
            update: {},
            create: {
                ...userData,
                studio: {
                    create: {}
                },
                subscription: {
                    create: {}
                },
                workspace: {
                    create: {
                        name: `${user.firstName}'s Workspace`,
                        type: 'PERSONAL'
                    }
                }
            },
            include: {
                workspace: true,
                subscription: {
                    select: { 
                        plan: true
                    }
                }
            }
        })

        if (userExist) {
            return { status: 200, user:userExist }
        }
        return { status: 201, user: userExist }

    } catch (e) {
        return { status: 500, data: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' }
    }
}



export const getUserNotifications = async () => {
    try {
        const user = await currentUser()

        if (!user) {
            return { status: 404, msg: 'User not found' }
        }

        const notifications = await db.user.findUnique({
            where: {
                clerkid: user.id
            },
            select: {
                notification: true,
                _count: {
                    select: {
                        notification: true
                    }
                }
            }
        })

        if (notifications && notifications.notification.length > 0) {
            return { status: 200, data: notifications }
        }
        return { status: 404, data: [] }
    } catch (e) {
        return { status: 500, msg: 'Internal server error', error: e instanceof Error ? e.message : 'Unknown error' }
    }
}



export const searchUser = async (query: string) => {
    try {
        const user = await currentUser()
        if (!user) {
            return { status: 404 }
        }

        const users = await db.user.findMany({
            where :{
                OR: [
                    { firstname: { contains: query } },
                    { email: { contains: query } },
                    { lastname: { contains: query } }
                ],
                NOT: [
                    { clerkid: user.id }
                ]
            },
            select: {
                id: true,
                subscription: {
                    select: {
                        plan: true
                    }
                },
                firstname: true,
                lastname: true,
                image: true,
                email: true
            }
        })

        if (users && users.length > 0) {
            return { status: 200, data: users }
        }
        return { status: 404, data: undefined }
    } catch (e) {
        return { status: 500, msg: e instanceof Error ? e.message : 'Unknown error', data: undefined }
    }
}



export const getPaymentInfo = async () => {
    try {
        const user = await currentUser()
        if (!user) {
            return { status: 404 }
        }

        const payment = await db.user.findUnique({
            where: {
                clerkid: user.id
            },
            select: {
                subscription: {
                    select: {
                        plan: true
                    }
                }
            }
        })

        if (payment) {
            return { status: 200, data: payment }
        }
    } catch (e) {
        return { status: 400 } 
    }    
}



export const getFirstView = async () => {
    try {
        const user = await currentUser()
        if (!user) {
            return { status: 404 }
        }
        const userData = await db.user.findUnique({
            where: {
                clerkid: user.id
            },
            select: {
                firstView: true
            }
        })
        if (userData) {
            return { status: 200, data: userData.firstView }
        }
        return { status: 400, data: false }
    } catch (e) {
        return { status: 500, msg: e instanceof Error ? e.message : 'Unknown error' }
    }
}



export const enableFirstView = async (state: boolean) => {
    try {
        const user  = await currentUser()
        if (!user) {
            return { status: 404 }
        }

        const view = await db.user.update({
            where: {
                clerkid: user.id
            },
            data: {
                firstView: state
            }
        })

        if (view) {
            return { status: 200, data: 'Setting Updated' }
        }
    } catch (e) {
        return { status: 400 }
    }
}



export const createCommentAndReply = async (
    userId: string,
    comment: string,
    videoId: string,
    commentId?: string
) => {
    try {
        if (commentId) {
            const reply = await db.comment.update({
                where: {
                    id: commentId
                },
                data: {
                    reply: {
                        create: {
                            comment,
                            userId,
                            videoId
                        }
                    }
                }
            })
            if (reply) {
                return { status: 200, data: 'Reply Posted' }
            }
        }


        const newComment = await db.video.update({
            where: {
                id: videoId
            },
            data: {
                Comment: {
                    create: {
                        comment,
                        userId
                    }
                }
            }
        })

        if (newComment) {
            return { status: 200, data: 'New comment added' }
        }
    } catch (e) {
        return { status: 400 }
    }
}



export const getUserProfile = async () => {
    try {
        const user = await currentUser()
        if (!user) {
            return { stauts: 404 }
        }

        const profileAndImage = await db.user.findUnique({
            where: {
                clerkid: user.id
            },
            select: {
                image: true,
                id: true
            }
        })

        if (profileAndImage) {
            return { status: 200, data: profileAndImage }
        }
    } catch (e) {
        return { status: 400 }
    }
}



export const getVideoComments = async (id: string) => {
    try {
        const comments = await db.comment.findMany({
            where: {
                OR: [   
                    { videoId: id },
                    { commentId: id }
                ],
                commentId: null
            },
            include: {
                reply: {
                    include: {
                        User: true
                    }
                },
                User: true
            }
        })
        return { status: 200, data: comments }
    } catch (e) {
        return { status: 400 }
    }
}



export const inviteMembers = async (
    workspaceId: string,
    recieverId: string,
    email: string
) => {
    try {
        const user = await currentUser();
        if (!user) return { status: 404 };

        const senderInfo = await db.user.findUnique({
            where: {
                clerkid: user.id
            },
            select: {
                id: true,
                firstname: true,
                lastname: true
            }
        });

        if (senderInfo?.id) {
            const workspace = await db.workspace.findUnique({
                where: {
                    id: workspaceId
                },
                select: {
                    name: true
                }
            });

            if (workspace) {
                // Check if the user has already been invited to the workspace
                const existingInvite = await db.invite.findFirst({
                    where: {
                        recieverId,
                        workspaceId: workspaceId
                    }
                });

                if (existingInvite) {
                    // If the user is already invited, return a response indicating so
                    return { status: 400, data: 'User is already invited to this workspace' };
                }

                // Proceed with creating the invite if no existing invite is found
                const invitation = await db.invite.create({
                    data: {
                        senderId: senderInfo.id,
                        recieverId,
                        workspaceId: workspaceId,
                        content: `You are invited to join ${workspace.name} Workspace, click accept to confirm`
                    },
                    select: {
                        id: true
                    }
                });

                await db.user.update({
                    where: {
                        clerkid: user.id
                    },
                    data: {
                        notification: {
                            create: {
                                content: `${user.firstName} ${user.lastName} invited ${senderInfo.firstname} ${senderInfo.lastname} into ${workspace.name}`
                            }
                        }
                    }
                });

                if (invitation) {
                    // Send email invitation
                    const { transporter, mailOptions } = await sendEmail(
                        email,
                        "You received an invitation",
                        `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
                        `<a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" style="background-color: #000; padding: 5px 10px; border-radius: 10px;">Accept Invite</a>`
                    );

                    // Send the email
                    transporter.sendMail(
                        mailOptions,
                        async (error, info) => {
                            if (error) {
                                console.log('❌', error.message);
                            } else {
                                console.log('✅ Email sent', info);
                            }
                        }
                    );

                    return { status: 200, data: 'Invite sent' };
                }

                return { status: 400, data: 'Invitation failed' };
            }

            return { status: 404, data: 'Workspace Not Found' };
        }

        return { status: 404, data: 'Recipient Not Found' };
    } catch (e) {
        console.error(e);
        return { status: 400, data: 'Oops! Something went wrong!' };
    }
};




export const acceptInvite = async (inviteId: string) => {
    try {
        const user = await currentUser()
        if (!user) return { status: 404 }

        const invitation = await db.invite.findUnique({
            where: {
                id: inviteId
            },
            select: {
                workspaceId: true,
                reciever: {
                    select: {
                        clerkid: true
                    }
                }
            }
        })

        if (user.id !== invitation?.reciever?.clerkid) {
            return { status: 401 }
        }
        const acceptInvite = db.invite.update({
            where: {
                id: inviteId
            },
            data: {
                accepted: true
            }
        })
        
        const updateMember = db.user.update({

            where: {
                clerkid: user.id
            },
            data: {
                members: {
                    create: {
                        workspaceId: invitation.workspaceId
                    }
                }
            }
        })

        const membersTransaction = await db.$transaction([
            acceptInvite,
            updateMember
        ])

        if (membersTransaction) {
            return { status: 200 }
        }
        return { status: 400 }
    } catch (e) {
        return { status: 400 }
    }
}


export const videoUpload = async (formData: FormData, workspaceId: string, folderId?: string) => {
    try {
        const user = await currentUser();
        if (!user) return { status: 404 };

        const videoId = nanoid();
        const fileExtension = '.webm';
        const filename = `${videoId}${fileExtension}`;

        const client = new S3Client({
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID!,
                secretAccessKey: process.env.SECRET_ACCESS_KEY!
            },
            region: process.env.BUCKET_REGION!
        })

        const { url, fields } = await createPresignedPost(client, {
            Bucket: process.env.BUCKET_NAME!,
            Key: filename,
            Fields: {
                "Content-Type": "video/webm"
            }
        })

        const formDataS3 = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
            formDataS3.append(key, value);
        })
        formDataS3.append('file', formData.get('file') as string);

        const uploadResponse = await fetch(url, {
            method: 'POST',
            body: formDataS3,
        })

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`Failed to upload file to S3: ${errorText}`);
        }

        if (uploadResponse.ok) {
            console.log('File uploaded successfully');
        } else {
            console.error('Failed to upload file');
        }

        const title = formData.get('title') as string || 'Untitled Video';
        
        const workspace = await db.user.findUnique({
            where: {
                clerkid: user.id
            },
            select: {
                workspace: {
                    where: {
                        id: workspaceId
                    }
                }
            }
        })

        if (workspace && workspace.workspace.length > 0) {
            const workspaceData = workspace.workspace[0];
        
            const videoData = {
                title: title,
                source: `${filename}`,
                processing: true,
                userId: workspaceData.userId,
                workspaceId: workspaceData.id,
                folderId: folderId || null,
            };
        
            const newVideo = await db.video.create({
                data: videoData,
                include: {
                    Workspace:{
                        select: {
                            id: true
                        }
                    },
                    User: {
                        select: {
                            firstname: true,
                            lastname: true,
                            image: true,
                            id: true
                        }
                    },
                    Folder: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
            console.log('Video created successfully:', newVideo);
    
            startVideoProcessing(newVideo.id).catch(console.error);
            
            return { success: true, video: newVideo };
        }
    } catch (err) {
        console.error('Error uploading video:', err);
        return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

async function startVideoProcessing(videoId: string) {
    try {
        // Implement your video processing logic here
        // For example, creating thumbnails, transcoding, etc.
        
        // When processing is complete, update the database
        await db.video.update({
            where: { id: videoId },
            data: { processing: false }
        });
    } catch (error) {
        console.error('Error processing video:', error);
        
        // Update the database to indicate processing failed
        await db.video.update({
            where: { id: videoId },
            data: { 
                processing: false,
                // You might want to add an error field to your schema
                // error: error instanceof Error ? error.message : 'Unknown error'
            }
        });
    }
}


// export const videoUpload = async (formData: FormData, userId: string, workspaceId: string, folderId?: string) => {
//     try {

        
//         // Get the S3 client
//         const client = new S3Client({
//             credentials: {
//                 accessKeyId: process.env.ACCESS_KEY_ID!,
//                 secretAccessKey: process.env.SECRET_ACCESS_KEY!
//             },
//             region: process.env.BUCKET_REGION!
//         });

//         // Create presigned URL for upload
        
//         });

//         if (!url || !fields) {
//             throw new Error('Failed to get presigned URL from S3');
//         }

//         // Prepare form data for S3 upload
//         const formDataS3 = new FormData();
//         Object.entries(fields).forEach(([key, value]) => {
//             formDataS3.append(key, value);
//         });

//         const file = formData.get('file');
//         if (!file) {
//             throw new Error('No file provided');
//         }

//         formDataS3.append('file', file);

//         // Upload to S3
//         const uploadResponse = await fetch(url, {
//             method: 'POST',
//             body: formDataS3,
//         });



//         const s3Url = `${filename}`;
        
        
// console.log(workspace);
        
//         // Create a new video entry in your database with explicit type definition
        
        
    
// };

// // This function would be implemented separately to handle video processing
