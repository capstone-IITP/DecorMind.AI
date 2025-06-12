import connectDB from "../../lib/mongodb";
import User from "../../models/User";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
    
    await connectDB();
    const { email } = req.query;
    
    if (!email) return res.status(400).json({ message: "Email is required" });
    
    try {
        let user = await User.findOne({ email });
        
        if (!user) {
            // Create new user if not exists
            user = await User.create({ email });
        }
        
        return res.status(200).json({ 
            user: {
                email: user.email,
                plan: user.plan,
                credits: user.credits
            } 
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}