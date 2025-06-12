import connectDB from "../../lib/mongodb";
import User from "../../models/User";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    await connectDB();
    const { email, plan } = req.body;

    if (!email || !plan) {
        return res.status(400).json({ message: "Email and plan are required" });
    }

    try {
        // Find user and update plan
        const validPlans = ["free", "pro", "enterprise"];
        
        if (!validPlans.includes(plan)) {
            return res.status(400).json({ message: "Invalid plan" });
        }

        // Set credits based on plan
        let credits = 2; // Default for free
        if (plan === "pro") credits = 10;
        if (plan === "enterprise") credits = 50;

        const user = await User.findOneAndUpdate(
            { email },
            { plan, credits },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Plan upgraded successfully",
            user: {
                email: user.email,
                plan: user.plan,
                credits: user.credits
            }
        });
    } catch (error) {
        console.error("Error upgrading plan:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
} 