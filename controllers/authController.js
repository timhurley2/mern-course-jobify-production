import User from "../models/User.js";
import ConfirmCode from "../models/ConfirmCode.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import attachCookie from "../utils/attachCookie.js";
import sendVerifyEmail from "../utils/sendEmail.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }
  const user = await User.create({ name, email, password });
  const confirmCode = await ConfirmCode.create({userId: user._id});
  const url = `http://localhost:3000/confirmemail/${confirmCode.code}`;

  sendVerifyEmail(user.email, url);
  res.status(StatusCodes.CREATED).json({user: {
        email: user.email,
        lastName: user.lastName,
        location: user.location,
        name: user.name,
        verified: user.verified,
      }});
  // const token = user.createJWT();
  // attachCookie({res, token});
  // res.status(StatusCodes.CREATED).json({
  //   user: {
  //     email: user.email,
  //     lastName: user.lastName,
  //     location: user.location,
  //     name: user.name,
  //   },
  //   location: user.location,
  // });

};

const validateEmail = async(req, res) => {
  const {code} = req.body;
  if(!code){
    throw new BadRequestError('Please click on link from email.');
  }
  const confirmCode = await ConfirmCode.findOne({code: code});
  if(! confirmCode){
    throw new BadRequestError('User not found.  Try logging in, or creating account.  Redirecting...');
  }
  const timeSinceCreation = Date.now() - confirmCode.createdAt;
  var limit = 1000 * 60 * 60 * 6;
  if(timeSinceCreation > limit){
    await User.deleteOne({_id: confirmCode.userId});
    await ConfirmCode.deleteOne(confirmCode);
    throw new BadRequestError('Too much time has elapsed since account creation.  Please recreate account.  Redirecting...');
  }
  await User.findOneAndUpdate({_id: confirmCode.userId}, {verified: true});
  await ConfirmCode.findOneAndUpdate({_id: confirmCode._id}, {code: ''
  });
  res.status(StatusCodes.OK).json({msg: 'Successfully validated user.  Redirecting...'});
}

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  if(!user.verified){
    throw new BadRequestError('The email address has not been verified.  Please check email for verification email and click on link');
  }
  const token = user.createJWT();

  user.password = undefined;
  attachCookie({res, token});
  res.status(StatusCodes.OK).json({ user, location: user.location });
};
const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("Please Provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.lastName = lastName;
  user.name = name;
  user.location = location;

  await user.save();

  const token = user.createJWT();
  attachCookie({res, token});
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({_id: req.user.userId});
  res.status(StatusCodes.OK).json({user, location: user.location})
}

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  });
  res.status(StatusCodes.OK).json({msg: 'User logged out!'});
}

export { register, login, updateUser, getCurrentUser,logout, validateEmail };
