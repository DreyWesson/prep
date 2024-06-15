import User from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide Email and Password", 400));
  }

  try {
    const user = await User.findOne({ email }).select("password");
    if (!user) {
      return next(new ErrorHandler("Invalid Credentials", 401));
    }

    const matchPsw = await user.matchPasswords(password);

    if (!matchPsw) {
      return next(new ErrorHandler("Invalid Credentials", 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
    });
  }
};

const forgotPsw = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("Email could not be sent", 404));
    }
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // passwordreset or resetpassword
    const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;
    const feedbackMessage = `<h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;

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

      await user.save();

      return next(new ErrorHandler("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
};

const resetPsw = async (req, res, next) => {
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
      return next(new ErrorHandler("Invalid Reset Token", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(201).json({ success: true, data: "Password Reset Successful" });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};

export { register, login, forgotPsw, resetPsw };
