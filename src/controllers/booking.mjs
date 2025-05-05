import mongoose from "mongoose";

const User = mongoose.model("User");
const Parking = mongoose.model("Parking");
const Booking = mongoose.model("Booking");

export const createBooking = async (req, res) => {
  try {
    const { parkingId, startTime, endTime } = req.body;
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
      status: "PENDING",
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

export const getUserBookings = async (req, res) => {
  try {
    const user = req.user;

    const bookings = await Booking.find({ user: user._id })
      .populate("parking")
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

export const getBookingsForOwnedParkings = async (req, res) => {
  try {
    const user = req.user;

    const parkings = await Parking.find({ owner: user._id });

    if (parkings.length === 0) {
      return res.send({
        success: true,
        bookings: [],
      });
    }

    const parkingIds = parkings.map((parking) => parking._id);
    const bookings = await Booking.find({
      parking: { $in: parkingIds },
    })
      .populate("user", "username firstName lastName")
      .populate("parking")
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

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const user = req.user;

    if (!["CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)) {
      return res.status(400).send({
        success: false,
        message: "Invalid status value",
      });
    }

    const booking = await Booking.findById(bookingId).populate("parking");

    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found",
      });
    }

    const parking = booking.parking;
    if (
      parking.owner.toString() !== user._id.toString() &&
      booking.user.toString() !== user._id.toString()
    ) {
      return res.status(403).send({
        success: false,
        message:
          "Access denied. Only the parking owner or the booking user can update this booking",
      });
    }

    booking.status = status;
    await booking.save();

    res.send({
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
