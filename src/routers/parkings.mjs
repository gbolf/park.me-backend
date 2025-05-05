import express from "express";
import {
  getParkingsByLocation,
  createParking,
  getMyParkings,
  bookParking,
  getBookedParkings,
  getParkingById,
} from "../controllers/parking.mjs";
import { requireAuth } from "../middleware/auth.mjs";

const router = express.Router();

router.use(requireAuth);

router.get("/myParkings", getMyParkings);

router.get("/bookedParkings", getBookedParkings);

router.get("/:parkingId", getParkingById);

router.post("/", createParking);

router.post("/:parkingId", bookParking);

router.get("/:longitude/:latitude", getParkingsByLocation);

export default router;
