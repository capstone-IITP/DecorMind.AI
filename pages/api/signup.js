import connectDB from "../../lib/mongodb";
import User from "../../models/User";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    await connectDB();

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        
        if (user) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Create new user
        user = await User.create({ email });
        
        return res.status(201).json({ 
            message: "User created successfully",
            user: {
                email: user.email,
                plan: user.plan,
                credits: user.credits
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
} 