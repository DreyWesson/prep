import crypto from "crypto";
import User from "../models/userSchema.js";
import ErrorHandler from "../utils/errorHandler.utils.js";
import sendEmail from "../utils/sendEmail.utils.js";

export const signup = async (req, res, next) => {
  const { lastName, firstName, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return next(new ErrorHandler("Password doesn't match", 400));

  try {
    const existingUser = await User.findOne({ email }).select("password");
    if (existingUser) return next(new ErrorHandler("User already exist", 400));
    let user = await User.create({
      lastName,
      firstName,
      email,
      password,
    });
    sendToken(user, 201, res);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const signin = async (req, res, next) => {
  console.log("💪SIGNIN 💪: ", req.body);
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler("Please provide Email and Password", 400));

  try {
    let existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) return next(new ErrorHandler("User doesn't exist", 401));

    const matchPsw = await existingUser.matchPasswords(password);
    if (!matchPsw) return next(new ErrorHandler("Invalid Credentials", 401));

    sendToken(existingUser, 200, res);
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error,
    });
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return next(new ErrorHandler("Email could not be sent", 404));

    const resetToken = user.getResetPasswordToken();
    console.log(resetToken);

    await user.save();

    // passwordreset or resetpassword
    const resetUrl = `http://memories-99585.web.app/resetpassword/${resetToken}`;
    const feedbackMessage = `<h1>You have requested a password reset</h1>
      <p>Please click reset button to reset your password</p>
      <p>${resetUrl}</p>
      <form action=${resetUrl} clicktracking=off>
    <input type="submit" value="Reset Password" style="background-color:#fe3d71; color: white; border: none; padding: 10px; border-radius: 20px;"/>
</form>`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Request Password Reset",
        text: feedbackMessage,
      });
      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      console.log("ERROR OCCURRED HERE");
      await user.save().catch((e) => {
        console.log(e);
      });
      return next(new ErrorHandler("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      console.log("INVALID");
      return next(new ErrorHandler("Invalid Reset Token", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save().catch;

    res.status(201).json({ success: true, data: "Password Reset Successful" });
  } catch (error) {
    next(error);
  }
};

// Figure out how to turn user to user.result // Done. ln 54
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  const { _doc, name, ...rest } = user;
  res
    .status(statusCode)
    .json({ result: { _doc, name, _id: _doc._id }, success: true, token });
};
