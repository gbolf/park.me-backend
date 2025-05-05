import mongoose from "mongoose";
const { Schema } = mongoose;

const coordinatesSchema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const addressSchema = new Schema({
  fullAddress: { type: String, required: true },
  street: { type: String, required: true },
  houseNumber: { type: String, required: true },
  place: { type: String, required: true },
  postCode: { type: String, required: true },
  country: { type: String, required: true },
  coordinates: { type: coordinatesSchema, required: true },
});

const parkingSchema = new Schema({
  title: { type: String, required: true },
  images: [{ type: String }],
  tags: [{ type: String }],
  price: { type: Number, required: true },
  description: { type: String, required: true },
  address: { type: addressSchema, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

parkingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Parking", parkingSchema);
