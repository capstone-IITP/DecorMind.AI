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
        console.log('Connecting to MongoDB...');
        
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }
        
        // Attempt to connect to MongoDB with more robust settings
        await mongoose.connect(MONGODB_URI, {
            dbName: 'decormind',
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000
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

