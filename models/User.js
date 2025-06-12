import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    plan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
    credits: { type: Number, default: 2 }
});

export default mongoose.models.User || mongoose.model("User", UserSchema); 