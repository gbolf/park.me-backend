import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { v7 as uuidv7 } from "uuid";
import User from "../models/user.mjs";
import Session from "../models/session.mjs";

const COOKIE_NAME = "session_token";

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, username } = req.body;
    if (!req.file || !req.file.location) {
      return res
        .status(400)
        .send({ success: false, error: "Profile image is required" });
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password: hash,
      firstName,
      lastName,
      username,
      profileImage: "https://s3.park.me.gbolf.com/park-me/" + req.file.key,
    });

    res.status(201).send({ success: true, message: "User registered" });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res
      .status(401)
      .send({ success: false, error: "Invalid credentials" });
  }

  const token = uuidv7();
  await Session.create({ token, userId: user._id });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    signed: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.send({ success: true, message: "Logged in" });
};

export const logout = async (req, res) => {
  const token = req.signedCookies[COOKIE_NAME];
  await Session.deleteOne({ token });
  res.clearCookie(COOKIE_NAME);
  res.send({ success: true, message: "Logged out" });
};

export const uploadFile = (req, res) => {
  const file = req.file;
  if (!file)
    return res.status(400).send({ success: false, error: "No file uploaded" });

  res.send({
    success: true,
    url: "https://s3.park.me.gbolf.com/park-me/" + file.key,
    filename: file.key,
    path: file.location,
  });
};
