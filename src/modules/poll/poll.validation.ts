import { z } from "zod";

export const TPollSchema = z.object({
    body: z.object({
        question: z.string().trim().min(1, { message: "Question is required!" }),
        options: z.array(z.string().trim().min(1, { message: "Option is required!" })).min(2, { message: "At least one option is required!" }),
        expiresIn: z.number(),
        hideResults: z.boolean().default(false),
    })
});

export const TReactionSchema = z.object({
    body: z.object({
        reaction: z.string().trim().min(1, { message: "Reaction is required!" }),
    })
});
