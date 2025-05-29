"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { downloadImageWithWatermark } from '../../lib/imageUtils';
import RoomDimensionForm from './RoomDimensionForm';
import { useUserDetail } from '../_context/UserDetailContext';
import { useRouter } from 'next/navigation';

export default function ImageGenerator() {
    const router = useRouter();
    const { userDetail, useCredit, loading: userLoading } = useUserDetail();
    const [prompt, setPrompt] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dimensions, setDimensions] = useState({
        length: "",
        width: "",
        height: "",
        unit: "feet"
    });

    const handleDimensionsChange = (newDimensions) => {
        setDimensions(newDimensions);
    };

    const generateImage = async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt");
            return;
        }

        if (!dimensions.length || !dimensions.width) {
            setError("Please enter room dimensions (at least length and width)");
            return;
        }

        // Check if user has available credits
        if (!userDetail.hasAvailableCredits) {
            setError(`You have used all your ${userDetail.totalCredits} credits. Please upgrade your plan to continue.`);
            // Redirect to pricing page after a short delay
            setTimeout(() => {
                router.push('/pricing');
            }, 2000);
            return;
        }

        setLoading(true);
        setError("");
        
        try {
            // Create a prompt that includes room dimensions
            const dimensionsText = dimensions.height 
                ? `Room dimensions are ${dimensions.length}x${dimensions.width}x${dimensions.height} ${dimensions.unit}.`
                : `Room dimensions are ${dimensions.length}x${dimensions.width} ${dimensions.unit}.`;
            
            const fullPrompt = `${prompt}. ${dimensionsText} Ensure furniture and spacing respect this scale.`;
            
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: fullPrompt }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to generate image");
            }
            
            // Use a credit for the successful generation
            useCredit();
            
            setImage(data.image);
        } catch (err) {
            console.error("Error generating image:", err);
            setError(err.message || "Failed to generate image");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadImage = async () => {
        try {
            await downloadImageWithWatermark(image, "generated-interior.png");
        } catch (error) {
            console.error("Error downloading image:", error);
        }
    };

    // Show credits information
    const renderCreditsInfo = () => {
        if (userLoading) return null;
        
        return (
            <div className="mb-4 text-sm text-gray-600">
                <p>
                    {userDetail.plan.charAt(0).toUpperCase() + userDetail.plan.slice(1)} Plan: {' '}
                    {userDetail.remainingCredits === 'unlimited' 
                        ? 'Unlimited Credits' 
                        : `${userDetail.remainingCredits} of ${userDetail.totalCredits} credits remaining`}
                </p>
                {userDetail.remainingCredits !== 'unlimited' && userDetail.remainingCredits <= 2 && (
                    <p className="text-amber-500 mt-1">
                        Running low on credits? <a href="/pricing" className="underline">Upgrade your plan</a>
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-medium mb-3">Generate Room Design</h3>
            
            {renderCreditsInfo()}
            
            <div className="mb-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your dream interior..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
            </div>
            
            <RoomDimensionForm 
                onSubmit={handleDimensionsChange}
            />
            
            <button 
                onClick={generateImage} 
                disabled={loading || !userDetail.hasAvailableCredits}
                className={`px-4 py-2 rounded-md text-white ${
                    loading || !userDetail.hasAvailableCredits
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-cyan-500 hover:bg-cyan-600"
                }`}
            >
                {loading ? "Generating..." : "Generate"}
            </button>
            
            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}
            
            {loading && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                        <p className="text-sm">Generating your dream interior...</p>
                    </div>
                </div>
            )}
            
            {image && (
                <div className="mt-4">
                    <div className="border border-gray-200 rounded-md overflow-hidden">
                        <Image 
                            src={image} 
                            alt="Generated Interior" 
                            width={500}
                            height={500}
                            className="w-full h-auto"
                            priority
                        />
                    </div>
                    <div className="mt-2 flex justify-end">
                        <button 
                            onClick={handleDownloadImage}
                            className="text-sm text-cyan-600 hover:text-cyan-800"
                        >
                            Download Image
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 