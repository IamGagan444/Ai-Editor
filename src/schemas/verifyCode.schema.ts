
import z from "zod"

export const verifyCodeSchema=z.object({
    verifyCode:z.string().length(6,"enter 6 digit number")
})