import mongoose from "mongoose";
const { Schema } = mongoose;

const bookingSchema = new Schema({
  parking: { type: Schema.Types.ObjectId, ref: "Parking", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
    default: "PENDING",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

bookingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Booking", bookingSchema);
