import { z } from 'zod'

export const editVideoSchema = z.object({
    title: z.string().nonempty('Video title must not be empty'),
    description: z.string().nonempty('Video description must not be empty')
})