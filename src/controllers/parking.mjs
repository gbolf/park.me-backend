import mongoose from "mongoose";

const User = mongoose.model("User");
const Parking = mongoose.model("Parking");
const Booking = mongoose.model("Booking");

export const getParkingsByLocation = async (req, res) => {
  try {
    const { longitude, latitude } = req.params;
    const userId = req.user._id;

    const long = parseFloat(longitude);
    const lat = parseFloat(latitude);

    if (isNaN(long) || isNaN(lat)) {
      return res.status(400).send({
        success: false,
        message: "Invalid coordinates provided",
      });
    }

    const parkings = await Parking.find({
      "address.coordinates.longitude": { $gte: long - 0.1, $lte: long + 0.1 },
      "address.coordinates.latitude": { $gte: lat - 0.1, $lte: lat + 0.1 },
      owner: { $ne: userId },
    }).populate("owner", "username firstName lastName");

    res.send({
      success: true,
      parkings,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

export const createParking = async (req, res) => {
  try {
    const { title, images, tags, price, description, address } = req.body;
    const user = req.user;

    const newParking = new Parking({
      title,
      images,
      tags,
      price,
      description,
      address,
      owner: user._id,
    });

    await newParking.save();

    await User.findByIdAndUpdate(user._id, {
      $push: { ownedParkings: newParking._id },
      $set: { role: "RENTER" },
    });

    res.status(201).send({
      success: true,
      parking: newParking,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

export const getAllParkings = async (req, res) => {
  try {
    const parkings = await Parking.find().populate(
      "owner",
      "username firstName lastName"
    );

    res.send({
      success: true,
      parkings,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

export const getParkingById = async (req, res) => {
  try {
    const { parkingId } = req.params;

    const parking = await Parking.findById(parkingId).populate(
      "owner",
      "username firstName lastName"
    );

    if (!parking) {
      return res.status(404).send({
        success: false,
        message: "Parking not found",
      });
    }

    res.send({
      success: true,
      parking,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

export const getMyParkings = async (req, res) => {
  try {
    const parkings = await Parking.find({ owner: req.user._id });

    res.send({
      success: true,
      parkings,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

export const bookParking = async (req, res) => {
  try {
    const { parkingId } = req.params;
    const { startTime, endTime } = req.body;
    const user = req.user;

    const parking = await Parking.findById(parkingId);
    if (!parking) {
      return res.status(404).send({
        success: false,
        message: "Parking not found",
      });
    }

    if (parking.owner.toString() === user._id.toString()) {
      return res.status(400).send({
        success: false,
        message: "You cannot book your own parking spot",
      });
    }

    const conflictingBookings = await Booking.find({
      parking: parkingId,
      status: { $in: ["PENDING", "CONFIRMED"] },
      $or: [
        {
          startTime: { $lte: new Date(startTime) },
          endTime: { $gt: new Date(startTime) },
        },
        {
          startTime: { $lt: new Date(endTime) },
          endTime: { $gte: new Date(endTime) },
        },
        {
          startTime: { $gte: new Date(startTime) },
          endTime: { $lte: new Date(endTime) },
        },
      ],
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).send({
        success: false,
        message:
          "This parking spot is not available for the selected time period",
      });
    }

    const booking = new Booking({
      parking: parkingId,
      user: user._id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      price: parking.price,
      status: "CONFIRMED",
    });

    await booking.save();

    await User.findByIdAndUpdate(user._id, {
      $push: { bookedParkings: booking._id },
    });

    res.status(201).send({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

export const getBookedParkings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
      status: { $in: ["PENDING", "CONFIRMED"] },
      endTime: { $gte: new Date() },
    })
      .populate({
        path: "parking",
        populate: { path: "owner", select: "username firstName lastName" },
      })
      .sort({ startTime: 1 });

    res.send({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};
