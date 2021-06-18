import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  role: { type: String, required: true },
  name: { type: String, required: true }, // Student, group, org
  regNum: { type: String }, // Only for org
  contactNum: { type: Number }, // group, org
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// allow students to see which jobs they have registered for
userSchema.virtual("registeredJobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "registrations",
});
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

const User = mongoose.model("User", userSchema);
export default User;
