import { z } from 'zod'

export const createCommentSchema = z.object({
    comment: z.string().nonempty('Comment cannot be empty')
})