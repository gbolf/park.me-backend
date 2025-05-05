import express from "express";
import { getProfile } from "../controllers/user.mjs";
import { requireAuth } from "../middleware/auth.mjs";

const router = express.Router();

router.get("/profile", requireAuth, getProfile);

export default router;
