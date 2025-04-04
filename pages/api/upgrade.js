import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const planCredits = {
    free: 2,
    pro: 10,
    enterprise: 500
};

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    await connectDB();
    const { email, newPlan } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.plan = newPlan;
    user.credits = planCredits[newPlan];
    await user.save();

    res.json({ message: `Upgraded to ${newPlan} plan`, user });
} 