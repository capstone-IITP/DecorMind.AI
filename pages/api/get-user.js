import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    await connectDB();
    const { email } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
}