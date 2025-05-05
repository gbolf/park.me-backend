import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profileImage: { type: String, default: null },
  role: {
    type: String,
    enum: ["RENTER", "CUSTOMER"],
    required: true,
    default: "CUSTOMER",
  },
  ownedParkings: [{ type: Schema.Types.ObjectId, ref: "Parking" }],
  bookedParkings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("User", userSchema);
