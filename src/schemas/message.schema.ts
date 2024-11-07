import z from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1)
    .max(300, "content should be lesshtan 300 charectors"),
  createdAt: z.date(),
});
