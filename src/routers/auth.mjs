import express from "express";
import { register, login, logout } from "../controllers/auth.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { v7 as uuidv7 } from "uuid";
import path from "path";

const router = express.Router();

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const r2Upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.R2_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv7()}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/register", r2Upload.single("profileImage"), register);
router.post("/login", login);
router.post("/logout", requireAuth, logout);

export default router;
