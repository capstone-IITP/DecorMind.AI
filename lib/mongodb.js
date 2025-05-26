import mongoose from "mongoose";

    // Global variable to track connection status
let isConnected = false;

export async function connectToDatabase() {
    // If already connected, return the existing connection
    if (isConnected) {
        return;
    }

    // Set strict query mode for Mongoose to prevent unknown field queries
    mongoose.set('strictQuery', true);

    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'decormind',
        });

        // Update connection status
        isConnected = true;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export default connectToDatabase;