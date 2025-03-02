import { z } from "zod";

export const workspaceSchema = z.object({
    name: z.string().nonempty('Workspace name cannot be empty')
})