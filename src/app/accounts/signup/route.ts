import { sentVerficationEmail } from "@/helper/sentVerifiacationEmail";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email, username, password } = await request.json();

  if (!email && !username && !password) {
    return Response.json(
      { success: false, message: "all fields are mandotory" },
      { status: 403 }
    );
  }
  try {
    await dbConnect();
    const isUsernameVerifiedUserExist = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (isUsernameVerifiedUserExist) {
      return Response.json(
        { success: false, message: "User already exist" },
        { status: 403 }
      );
    }

    const isEmailRegisterd = await UserModel.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDateOfCode = new Date(Date.now() + 15 * 60 * 1000);
    if (isEmailRegisterd) {
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDateOfCode,
        isVerified: false,
        messages: [],
        isAcceptingMessages: true,
      });
      await newUser.save();

      const emailResponse = await sentVerficationEmail({
        email,
        username,
        verificationCode: verifyCode,
      });
      if (!emailResponse.success) {
        return Response.json(
          { message: emailResponse.message, success: false },
          { status: 403 }
        );
      }

      return Response.json(
        { success: true, message: "user registered, please verify your email" },
        { status: 200 }
      );




    }
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, message: "something went wrong" },
      { status: 500 }
    );
  }
}
