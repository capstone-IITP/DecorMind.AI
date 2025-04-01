"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageGenerator() {
    const [prompt, setPrompt] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const generateImage = async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt");
            return;
        }

        setLoading(true);
        setError("");
        
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to generate image");
            }
            
            setImage(data.image);
        } catch (err) {
            console.error("Error generating image:", err);
            setError(err.message || "Failed to generate image");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-medium mb-3">Generate Room Design</h3>
            
            <div className="mb-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your dream interior..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
            </div>
            
            <button 
                onClick={generateImage} 
                disabled={loading}
                className={`px-4 py-2 rounded-md text-white ${
                    loading 
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
                        <a 
                            href={image}
                            download="generated-interior.png"
                            className="text-sm text-cyan-600 hover:text-cyan-800"
                        >
                            Download Image
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
} 