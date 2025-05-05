import mongoose from "mongoose";
import Session from "../models/session.mjs";

const COOKIE_NAME = "session_token";

export const requireAuth = async (req, res, next) => {
  const token = req.signedCookies[COOKIE_NAME];
  if (!token)
    return res.status(401).send({ success: false, error: "Not authenticated" });

  const session = await Session.findOne({ token }).populate("userId");
  if (!session)
    return res.status(401).send({ success: false, error: "Invalid session" });

  req.user = session.userId;
  next();
};
