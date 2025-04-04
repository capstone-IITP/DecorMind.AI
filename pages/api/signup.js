import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    await connectDB();
    const { email } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ email, plan: "free", credits: 2 });
    await user.save();

    res.status(201).json({ message: "Signup successful!", user });
} 