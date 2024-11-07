import { Resend } from "resend";
import EmailTemplate from "../../emails/EmailTemplate";
import { ApiResponse } from "@/types/Apiresponse";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SentVerificationEmailProps {
  email: string;
  username?: string;
  verificationCode: string;
}

export async function sentVerficationEmail({
  email,
  username,
  verificationCode,
}: SentVerificationEmailProps): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Hello world",
      react: EmailTemplate({ username, verificationCode }),
    });

    console.log(data, error);

    return {
      status: 200,
      message: "otp hase sent successfully",
      success: true,
    };
  } catch (error) {
    console.log(error)
    return ({ message:"otp sent failed",success:false , status: 500 });
  }
}
