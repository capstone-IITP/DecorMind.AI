import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    await connectDB();
    const { email } = req.body; // Email se user identify karenge

    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.credits <= 0) return res.status(403).json({ message: "Out of credits! Upgrade your plan." });

    user.credits -= 1; // Reduce credit
    await user.save();

    res.json({ message: "Design generated!", remaining_credits: user.credits });
} 