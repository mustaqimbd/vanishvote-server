import { z } from "zod";

export const TVoteSchema = z.object({
    body: z.object({
        option: z.string().trim().min(1, { message: "Option is required!" }),
    })
});
